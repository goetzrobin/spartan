import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compareParts, extractApply, extractMarkedClasses, mergeParts, RENAMES } from '../lib/parity.mjs';

describe('extractApply', () => {
	it('reads @apply lists of bare cn- rules and skips compound selectors', () => {
		const css = [
			'.style-vega {',
			'  /* MARK: Tooltip { braces in a comment } */',
			'  .cn-tooltip-content {',
			'    @apply data-open:animate-in  rounded-md px-3 rounded-md;',
			'  }',
			'  .cn-card-content:has(> [data-slot=x]) {',
			'    @apply flex;',
			'  }',
			'}',
		].join('\n');
		const { parts, skipped } = extractApply(css);
		assert.deepEqual(parts, { 'tooltip-content': ['data-open:animate-in', 'px-3', 'rounded-md'] });
		assert.deepEqual(skipped, ['.cn-card-content:has(> [data-slot=x])']);
	});
});

describe('extractMarkedClasses', () => {
	it('reads tsx className strings and cva strings, dropping the markers', () => {
		const tsx = [
			'const variants = cva("cn-button inline-flex", { variants: { size: { sm: "cn-button-size-sm h-8" } } })',
			'export function Tip({ className }) {',
			'  return <div data-slot="tip" className={cn("cn-tip cn-tip-logical z-50 w-fit", className)}>',
			'    <span className={cn("cn-tip-arrow size-2", "group/x", props.open && "hidden", className)} />',
			'    {"just text"}',
			'  </div>',
			'}',
		].join('\n');
		assert.deepEqual(extractMarkedClasses('tip.tsx', tsx, 'cn-'), {
			button: ['inline-flex'],
			'button-size-sm': ['h-8'],
			tip: ['w-fit', 'z-50'],
			'tip-logical': ['w-fit', 'z-50'],
			'tip-arrow': ['group/x', 'size-2'],
		});
	});

	it('reads helm marker strings, template literals and class attributes in templates', () => {
		const source = [
			"import { hlm } from '@spartan-ng/helm/utils';",
			"export const A = hlm('spartan-tooltip-content bg-foreground data-open:animate-in', 'text-balance', x);",
			'classes(() => `spartan-input flex-1`);',
			"classes(() => ['spartan-tabs-trigger relative', 'after:absolute', cond ? 'a' : 'b', 'spartan-other z-1']);",
			"const pair = ['spartan-alone', 'gap-1'];",
			"cva('spartan-button inline-flex', { variants: { size: { sm: 'spartan-button-size-sm h-8' } } });",
			'@Component({ template: `<div class="spartan-handle z-10 flex" [attr.data-matches-spartan-invalid]="x"></div>` })',
			'class C {}',
			"const other = 'data-matches-spartan-invalid';",
		].join('\n');
		assert.deepEqual(extractMarkedClasses('hlm.ts', source, 'spartan-'), {
			'tooltip-content': ['bg-foreground', 'data-open:animate-in', 'text-balance'],
			input: ['flex-1'],
			'tabs-trigger': ['after:absolute', 'relative'],
			other: ['after:absolute', 'z-1'],
			alone: ['gap-1'],
			button: ['inline-flex'],
			'button-size-sm': ['h-8'],
			handle: ['flex', 'z-10'],
		});
	});
});

describe('extractApply with the helm prefix', () => {
	it('reads spartan- rules from the registry css', () => {
		const css = ['.style-vega {', '\t.spartan-tooltip-content {', '\t\t@apply px-3 text-xs;', '\t}', '}'].join('\n');
		assert.deepEqual(extractApply(css, 'spartan-'), { parts: { 'tooltip-content': ['px-3', 'text-xs'] }, skipped: [] });
	});
});

describe('mergeParts', () => {
	it('unions classes per part, sorted and unique', () => {
		assert.deepEqual(mergeParts({ a: ['y', 'x'] }, { a: ['x', 'z'], b: [] }), { a: ['x', 'y', 'z'], b: [] });
	});
});

describe('compareParts', () => {
	const shadcn = {
		tooltip: ['data-open:animate-in', 'origin-(--transform-origin)', 'rounded-md'],
		badge: ['h-5'],
		kbd: ['h-5'],
	};
	const helm = {
		tooltip: ['data-open:animate-in', 'origin-(--radix-tooltip-content-transform-origin)', 'text-balance'],
		badge: ['h-5'],
		'rtl-flip': [],
	};

	it('reports classes on one side only, and parts missing in helm', () => {
		const result = compareParts(shadcn, helm);
		assert.deepEqual(result.parts, [
			{ part: 'badge', onlyInHelm: [], onlyInShadcn: [] },
			{
				part: 'tooltip',
				onlyInHelm: ['origin-(--radix-tooltip-content-transform-origin)', 'text-balance'],
				onlyInShadcn: ['origin-(--transform-origin)', 'rounded-md'],
			},
		]);
		assert.deepEqual(result.missingInHelm, ['kbd']);
		assert.deepEqual(result.counts, {
			classesOnlyInHelm: { helm: 2 },
			classesOnlyInShadcn: { helm: 2 },
			partsMissingInHelm: { helm: 1 },
		});
	});

	it('does not count differences on the allowlist', () => {
		const allow = { tooltip: { onlyInHelm: ['text-balance'], onlyInShadcn: ['rounded-md'], reason: 'intended' } };
		const result = compareParts(shadcn, helm, allow);
		assert.deepEqual(result.counts.classesOnlyInHelm, { helm: 1 });
		assert.deepEqual(result.counts.classesOnlyInShadcn, { helm: 1 });
	});

	it('does not hide the transform-origin rename', () => {
		assert.deepEqual(RENAMES, []);
	});
});
