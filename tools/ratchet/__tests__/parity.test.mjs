import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compareParts, extractApply, extractMarkedClasses, mergeParts, translate } from '../lib/parity.mjs';

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

	it('leaves a missing part out of the count when it is marked out of scope', () => {
		const result = compareParts({ 'checkbox-aria': ['flex'] }, {}, { 'checkbox-aria': { outOfScope: 'React Aria' } });
		assert.deepEqual(result.counts.partsMissingInHelm, { helm: 0 });
		assert.deepEqual(result.outOfScope, ['checkbox-aria']);
	});

	it('reports the class as each side wrote it', () => {
		const result = compareParts({ item: ['pl-2', 'ml-auto'] }, { item: ['ps-2', 'me-auto'] });
		assert.deepEqual(result.parts, [{ part: 'item', onlyInHelm: ['me-auto'], onlyInShadcn: ['ml-auto'] }]);
	});
});

describe('translate', () => {
	const equal = [
		['data-[matches-spartan-invalid=true]:ring-3', 'aria-invalid:ring-3'],
		[
			'dark:has-data-[matches-spartan-invalid=true]:border-destructive/50',
			'dark:has-aria-invalid:border-destructive/50',
		],
		["[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)]", "[&_svg:not([class*='size-'])]:size-4"],
		['[&>ng-icon]:shrink-0', '[&>svg]:shrink-0'],
		['data-[state=open]:animate-in', 'data-open:animate-in'],
		['group-data-[orientation=vertical]/tabs:flex-col', 'group-data-vertical/tabs:flex-col'],
		['data-[disabled=true]:opacity-50', 'data-disabled:opacity-50'],
		['text-left', 'text-start'],
		['data-inset:pl-8', 'data-inset:ps-8'],
		['-ml-1', '-ms-1'],
		['rounded-tl-md', 'rounded-ss-md'],
	];
	for (const [one, other] of equal) {
		it(`counts ${one} and ${other} as equal`, () => {
			assert.equal(translate(one), translate(other));
		});
	}

	const different = [
		['data-starting-style:opacity-0', 'data-open:fade-in-0'],
		['data-[side=left]:slide-in-from-right-2', 'data-[side=inline-start]:slide-in-from-right-2'],
		['origin-(--transform-origin)', 'origin-(--brn-popover-transform-origin)'],
		['ml-2', 'me-2'],
		['data-[slot=input-group]:h-8', 'data-slot:h-8'],
	];
	for (const [one, other] of different) {
		it(`keeps ${one} and ${other} apart`, () => {
			assert.notEqual(translate(one), translate(other));
		});
	}

	it('leaves the selector inside a variant alone', () => {
		assert.equal(translate('[&_[data-pos=left]]:flex'), '[&_[data-pos=left]]:flex');
	});
});
