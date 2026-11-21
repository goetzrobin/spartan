// Entry point so `node --test tools/verify/__tests__/cy/` works: Node 22 resolves a directory
// argument as a module (this file) rather than scanning it for test files.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
for (const f of readdirSync(dir)
	.filter((f) => f.endsWith('.test.mjs'))
	.sort()) {
	await import(new URL(f, import.meta.url).href);
}
