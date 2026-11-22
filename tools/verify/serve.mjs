#!/usr/bin/env node
// Serves the browser-only production build of the docs app (`VERIFY_BUILD=1 nx build app`) as
// plain files. Any address that is not a file gets index.html, so the app's own router can show
// the page, the way a static host does for a single-page app.
//
// Usage: node tools/verify/serve.mjs [--dir dist/apps/app/client] [--port 4300]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const dir = path.resolve(ROOT, option('--dir', 'dist/apps/app/client'));
const port = Number(option('--port', process.env['PORT'] ?? 4300));

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(path.join(dir, 'index.html'))) {
	console.error(`No build found in ${dir}. Run: VERIFY_BUILD=1 pnpm nx build app`);
	process.exit(1);
}

/** The file a request path names, or null when it names none or points outside the build. */
export function fileFor(root, urlPath) {
	const file = path.join(root, decodeURIComponent(urlPath.split('?')[0]));
	if (file !== root && !file.startsWith(root + path.sep)) return null;
	return existsSync(file) && statSync(file).isFile() ? file : null;
}

createServer((request, response) => {
	let file = null;
	try {
		file = fileFor(dir, request.url ?? '/');
	} catch {
		// A malformed address is treated like any other unknown one.
	}
	// A missing asset must stay a 404: answering it with index.html would hide a broken build.
	const isAsset = path.extname((request.url ?? '').split('?')[0]) !== '';
	if (!file && isAsset) {
		response.writeHead(404).end('Not found');
		return;
	}
	const target = file ?? path.join(dir, 'index.html');
	response.writeHead(200, { 'content-type': TYPES[path.extname(target)] ?? 'application/octet-stream' });
	createReadStream(target).pipe(response);
}).listen(port, () => console.log(`Serving ${path.relative(ROOT, dir)} on http://localhost:${port}`));
