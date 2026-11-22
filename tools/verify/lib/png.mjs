import { crc32, deflateSync, inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function decodePng(buffer) {
	if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error('not a PNG file');
	let width = 0;
	let height = 0;
	let channels = 0;
	const chunks = [];
	for (let offset = 8; offset < buffer.length; ) {
		const length = buffer.readUInt32BE(offset);
		const type = buffer.toString('latin1', offset + 4, offset + 8);
		const body = buffer.subarray(offset + 8, offset + 8 + length);
		if (type === 'IHDR') {
			width = body.readUInt32BE(0);
			height = body.readUInt32BE(4);
			const [depth, colorType, , , interlace] = body.subarray(8, 13);
			channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 0;
			if (depth !== 8 || channels === 0 || interlace !== 0) throw new Error('unsupported PNG variant');
		} else if (type === 'IDAT') {
			chunks.push(body);
		}
		offset += 12 + length;
	}

	const raw = inflateSync(Buffer.concat(chunks));
	const stride = width * channels;
	const data = Buffer.alloc(stride * height);
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (stride + 1)];
		const input = y * (stride + 1) + 1;
		const output = y * stride;
		for (let x = 0; x < stride; x++) {
			const left = x >= channels ? data[output + x - channels] : 0;
			const up = y > 0 ? data[output + x - stride] : 0;
			const upLeft = y > 0 && x >= channels ? data[output + x - stride - channels] : 0;
			let predicted = 0;
			if (filter === 1) predicted = left;
			else if (filter === 2) predicted = up;
			else if (filter === 3) predicted = (left + up) >> 1;
			else if (filter === 4) {
				const estimate = left + up - upLeft;
				const dLeft = Math.abs(estimate - left);
				const dUp = Math.abs(estimate - up);
				const dUpLeft = Math.abs(estimate - upLeft);
				predicted = dLeft <= dUp && dLeft <= dUpLeft ? left : dUp <= dUpLeft ? up : upLeft;
			}
			data[output + x] = (raw[input + x] + predicted) & 0xff;
		}
	}
	return { width, height, channels, data };
}

// Chromium screenshots are not bit-exact between runs: an antialiased edge can differ by a shade.
export function comparePng(first, second, tolerance = 16) {
	const a = decodePng(first);
	const b = decodePng(second);
	const totalPixels = a.width * a.height;
	if (a.width !== b.width || a.height !== b.height) return { sameSize: false, changedPixels: totalPixels, totalPixels };
	let changedPixels = 0;
	for (let pixel = 0; pixel < totalPixels; pixel++) {
		for (let channel = 0; channel < 3; channel++) {
			if (Math.abs(a.data[pixel * a.channels + channel] - b.data[pixel * b.channels + channel]) > tolerance) {
				changedPixels++;
				break;
			}
		}
	}
	return { sameSize: true, changedPixels, totalPixels };
}

function chunk(type, body) {
	const head = Buffer.alloc(8);
	head.writeUInt32BE(body.length, 0);
	head.write(type, 4, 'latin1');
	const tail = Buffer.alloc(4);
	tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
	return Buffer.concat([head, body, tail]);
}

export function encodePng(width, height, rgb) {
	const header = Buffer.alloc(13);
	header.writeUInt32BE(width, 0);
	header.writeUInt32BE(height, 4);
	header.set([8, 2, 0, 0, 0], 8);
	const stride = width * 3;
	const raw = Buffer.alloc((stride + 1) * height);
	for (let y = 0; y < height; y++) rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
	return Buffer.concat([
		SIGNATURE,
		chunk('IHDR', header),
		chunk('IDAT', deflateSync(raw)),
		chunk('IEND', Buffer.alloc(0)),
	]);
}

export function diffPng(before, after, tolerance = 16) {
	const a = decodePng(before);
	const b = decodePng(after);
	const width = Math.max(a.width, b.width);
	const height = Math.max(a.height, b.height);
	const out = Buffer.alloc(width * height * 3);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const inA = x < a.width && y < a.height;
			const inB = x < b.width && y < b.height;
			const at = (image) => (y * image.width + x) * image.channels;
			let changed = inA !== inB;
			if (inA && inB) {
				for (let channel = 0; channel < 3; channel++) {
					if (Math.abs(a.data[at(a) + channel] - b.data[at(b) + channel]) > tolerance) changed = true;
				}
			}
			const target = (y * width + x) * 3;
			if (changed) {
				out.set([225, 29, 72], target);
			} else {
				const source = inB ? b : a;
				for (let channel = 0; channel < 3; channel++) {
					out[target + channel] = 255 - ((255 - source.data[at(source) + channel]) >> 2);
				}
			}
		}
	}
	return encodePng(width, height, out);
}
