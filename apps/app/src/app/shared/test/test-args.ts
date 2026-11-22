import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Lets a test override a page's inputs from the address bar, in the format the old Storybook
 * URLs used: `?args=disabled:true;value:apple`. Only keys the page declares can be set.
 *
 * A value is coerced to the type of the page's default for that key. Where the default is
 * `undefined` or `null`, `true`/`false` become booleans, numeric text becomes a number, and
 * anything else stays a string.
 */
export function applyTestArgs(page: object, keys: readonly string[]): void {
	const raw = inject(ActivatedRoute).snapshot.queryParamMap.get('args');
	if (!raw) return;

	const target = page as Record<string, unknown>;
	for (const pair of raw.split(';')) {
		const separator = pair.indexOf(':');
		if (separator < 1) continue;
		const key = pair.slice(0, separator);
		if (!keys.includes(key)) {
			// A test that sets something the page ignores would pass without testing it.
			throw new Error(`Test page does not take the arg "${key}". It takes: ${keys.join(', ') || 'none'}.`);
		}
		target[key] = coerce(pair.slice(separator + 1), target[key]);
	}
}

function coerce(value: string, current: unknown): unknown {
	if (value === '!undefined') return undefined;
	if (value === '!null') return null;
	if (typeof current === 'string') return value;
	if (typeof current === 'boolean') return value === 'true';
	if (typeof current === 'number') return Number(value);
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value !== '' && !Number.isNaN(Number(value))) return Number(value);
	return value;
}
