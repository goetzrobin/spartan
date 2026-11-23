#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractApply, extractMarkedClasses, mergeParts, STYLE } from './lib/parity.mjs';

const OUTPUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shadcn-classes.json');
const CSS = `apps/v4/registry/styles/style-${STYLE}.css`;
const UI = 'apps/v4/registry/bases/base/ui';

function fromArgument() {
	const args = process.argv.slice(2);
	const index = args.indexOf('--from');
	if (index === -1 || args[index + 1] === undefined) {
		console.error('usage: node tools/ratchet/shadcn-snapshot.mjs --from <path to a shadcn-ui/ui checkout>');
		process.exit(2);
	}
	return path.resolve(args[index + 1]);
}

function commitOf(checkout) {
	const result = spawnSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
	if (result.status !== 0) {
		console.error(`shadcn-snapshot: cannot read the commit of ${checkout}: ${result.stderr.trim()}`);
		process.exit(2);
	}
	return result.stdout.trim();
}

function main() {
	const checkout = fromArgument();
	const commit = commitOf(checkout);
	const { parts: cssParts, skipped } = extractApply(readFileSync(path.join(checkout, CSS), 'utf8'));
	const uiDir = path.join(checkout, UI);
	const tsxParts = readdirSync(uiDir)
		.filter((name) => name.endsWith('.tsx'))
		.sort()
		.map((name) => extractMarkedClasses(name, readFileSync(path.join(uiDir, name), 'utf8'), 'cn-'));
	const parts = mergeParts(cssParts, ...tsxParts);
	writeFileSync(OUTPUT, `${JSON.stringify({ commit, style: STYLE, parts }, null, '\t')}\n`);
	console.log(`shadcn-snapshot: ${Object.keys(parts).length} parts from ${commit} written to ${OUTPUT}`);
	for (const selector of skipped) console.log(`shadcn-snapshot: skipped rule with a compound selector: ${selector}`);
}

main();
