// Just enough PNG to compare two screenshots without adding a dependency: decodes 8-bit RGB and
// RGBA images (what browsers write) and counts the pixels that really differ.

import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** @returns {{ width: number, height: number, channels: number, data: Buffer }} */
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

/**
 * Counts pixels whose colour differs by more than `tolerance` in any channel (0 to 255).
 * Rendering is not bit-exact from run to run: the edge of a focus ring can come out one shade
 * lighter. A tolerance keeps that from being reported as a visual change.
 * @returns {{ sameSize: boolean, changedPixels: number, totalPixels: number }}
 */
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
