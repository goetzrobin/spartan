import { createRequire } from 'node:module';
import path from 'node:path';
import * as prettier from 'prettier';

const require = createRequire(import.meta.url);

/** @type {Map<string, Promise<prettier.Options | null>>} */
const configCache = new Map();

/**
 * Prettier options from the repo config. Plugin names are resolved to absolute paths so the
 * result does not depend on the working directory.
 * @param {string} repoRoot
 */
function repoConfig(repoRoot) {
	let p = configCache.get(repoRoot);
	if (!p) {
		p = prettier.resolveConfig(path.join(repoRoot, 'apps/ui-e2e/src/index.ts'), { editorconfig: true }).then((cfg) => {
			if (!cfg) return null;
			const plugins = (cfg.plugins ?? []).map((pl) => (typeof pl === 'string' ? require.resolve(pl) : pl));
			return { ...cfg, plugins };
		});
		configCache.set(repoRoot, p);
	}
	return p;
}

/**
 * Format with the repo's prettier config. `virtualPath` is the repo path the file would have,
 * which keeps the result independent of `--out-dir`. Falls back to the input on any error.
 * @param {string} code
 * @param {string} repoRoot
 * @param {string} virtualPath repo-relative path used to pick the parser and overrides
 * @returns {Promise<{ code: string, formatted: boolean, error?: string }>}
 */
export async function format(code, repoRoot, virtualPath) {
	try {
		const cfg = await repoConfig(repoRoot);
		const out = await prettier.format(code, { ...(cfg ?? {}), filepath: path.join(repoRoot, virtualPath) });
		return { code: out, formatted: true };
	} catch (e) {
		return { code, formatted: false, error: e instanceof Error ? e.message : String(e) };
	}
}
