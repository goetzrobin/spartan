import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pageClassName, splitFullId, storyId, titleId } from '../../lib/story-ids.mjs';
import { buildTestPages } from '../../story-to-test-pages.mjs';

const story = (body, extraMeta = '') => `
import { HlmButton } from '@spartan-ng/helm/button';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmButton> = {
	title: 'Alert Dialog',
	component: HlmButton,
	decorators: [moduleMetadata({ imports: [HlmButton] })],
	${extraMeta}
};
export default meta;
type Story = StoryObj<HlmButton>;
${body}
`;

const page = (built, name) => built.files.find((file) => file.file.endsWith(`/${name}.page.ts`))?.content;

describe('story ids', () => {
	it('match the ids Storybook derives from the export name', () => {
		assert.equal(storyId('Default'), 'default');
		assert.equal(storyId('NearViewportEdge'), 'near-viewport-edge');
		assert.equal(storyId('DynamicComponentWithDefaultOptions'), 'dynamic-component-with-default-options');
		assert.equal(storyId('WithRTLSupport'), 'with-rtl-support');
		assert.equal(storyId('Size2xl'), 'size-2-xl');
		assert.equal(titleId('Alert Dialog'), 'alert-dialog');
		assert.equal(titleId('Forms/Input OTP'), 'forms-input-otp');
		assert.deepEqual(splitFullId('date-picker--with-min-date'), { title: 'date-picker', story: 'with-min-date' });
		assert.equal(pageClassName('Alert Dialog', 'NearViewportEdge'), 'AlertDialogNearViewportEdgeTestPage');
	});
});

describe('buildTestPages', () => {
	it('turns a plain template story into a page under /test/<title>/<story>', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(`export const Default: Story = { render: () => ({ template: \`<button hlmBtn>Go</button>\` }) };`),
		);
		assert.deepEqual(built.skipped, []);
		assert.deepEqual(
			built.pages.map((p) => [p.id, p.route]),
			[['alert-dialog--default', '/test/alert-dialog/default']],
		);
		const content = page(built, 'default');
		assert.match(content, /selector: 'spartan-test-alert-dialog-default'/);
		assert.match(content, /imports: \[SpartanTestShell, HlmButton\]/);
		assert.match(content, /<spartan-test-shell><button hlmBtn>Go<\/button><\/spartan-test-shell>/);
		assert.match(content, /export default class AlertDialogDefaultTestPage/);
		assert.doesNotMatch(content, /@storybook/);
	});

	it('expands argsToTemplate into bindings and exposes the args as overridable fields', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Sized: Story = {
					args: { size: 'lg', clicked: (event) => console.log(event), hidden: undefined },
					render: ({ ...args }) => ({ props: { ...args, count: 0 }, template: \`<button hlmBtn \${argsToTemplate(args)}>{{ count }}</button>\` }),
				};`,
				`args: { variant: 'outline', size: 'sm' },`,
			),
		);
		const content = page(built, 'sized');
		assert.match(content, /<button hlmBtn \[variant\]="variant" \[size\]="size" \(clicked\)="clicked\(\$event\)">/);
		assert.match(content, /protected variant: any = 'outline';/);
		assert.match(content, /protected size: any = 'lg';/, 'the story overrides the meta default');
		assert.match(content, /protected count: any = 0;/);
		assert.match(content, /applyTestArgs\(this, \['variant', 'size', 'clicked', 'hidden'\]\)/);
		assert.deepEqual(built.pages[0].args, ['variant', 'size', 'clicked', 'hidden']);
	});

	it('honours include and exclude in argsToTemplate', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const A: Story = { render: (args) => ({ props: args, template: \`<b \${argsToTemplate(args, { exclude: ['size'] })}></b>\` }) };
				 export const B: Story = { render: (args) => ({ props: args, template: \`<b \${argsToTemplate(args, { include: ['size'] })}></b>\` }) };`,
				`args: { variant: 'outline', size: 'sm' },`,
			),
		);
		assert.match(page(built, 'a'), /<b \[variant\]="variant"><\/b>/);
		assert.match(page(built, 'b'), /<b \[size\]="size"><\/b>/);
	});

	it('moves helper components into a shared cases file and imports them where used', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`@Component({ selector: 'my-case', template: 'x' })
				class MyCase {}
				const LABEL = 'hello';
				export const WithHelper: Story = {
					decorators: [moduleMetadata({ imports: [MyCase] })],
					render: () => ({ props: { label: LABEL }, template: '<my-case />' }),
				};`,
			),
		);
		const cases = built.files.find((file) => file.file.endsWith('alert-dialog.cases.ts')).content;
		assert.match(cases, /@Component\(\{ selector: 'my-case', template: 'x' \}\)\s+export class MyCase \{\}/);
		assert.match(cases, /export const LABEL = 'hello';/);
		const content = page(built, 'with-helper');
		assert.match(content, /import \{ LABEL, MyCase \} from '.\/alert-dialog.cases';/);
		assert.match(content, /imports: \[SpartanTestShell, HlmButton, MyCase\]/);
	});

	it('reads moduleMetadata returned from render like the decorator', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`@Component({ selector: 'my-case', template: 'x' })
				class MyCase {}
				export const Inline: Story = {
					render: () => ({ moduleMetadata: { imports: [MyCase], providers: [provideThing()] }, template: '<my-case />' }),
				};`,
			),
		);
		assert.deepEqual(built.skipped, []);
		assert.match(page(built, 'inline'), /imports: \[SpartanTestShell, HlmButton, MyCase\]/);
		assert.match(page(built, 'inline'), /providers: \[provideThing\(\)\]/);
	});

	it('builds props in the constructor when the story computes them from local values or the args', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Local: Story = {
					render: () => {
						const form = new FormGroup({ email: new FormControl('') });
						return { props: { form }, template: '<b></b>' };
					},
				};
				export const FromArgs: Story = {
					args: { value: 'apple' },
					render: (args) => ({ props: { ...args, group: new FormGroup({ fruit: new FormControl(args.value) }) }, template: '<b></b>' }),
				};`,
			),
		);
		assert.deepEqual(built.skipped, []);
		const local = page(built, 'local');
		assert.match(local, /protected form: any;/);
		assert.match(
			local,
			/constructor\(\) \{\s+const form = new FormGroup\(\{ email: new FormControl\(''\) \}\);\s+this\.form = form;\s+\}/,
		);
		const fromArgs = page(built, 'from-args');
		assert.match(fromArgs, /protected value: any = 'apple';/);
		assert.match(
			fromArgs,
			/applyTestArgs\(this, \['value'\]\);\s+const args = this as any;\s+this\.group = new FormGroup/,
		);
	});

	it('handles args taken by name in the render parameters', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Named: Story = {
					render: ({ disabled, ...args }) => ({
						props: { disabled, ...args, isDisabled: disabled },
						template: \`<button hlmBtn \${argsToTemplate(args)} [disabled]="isDisabled">x</button>\`,
					}),
				};`,
				`args: { variant: 'outline', disabled: true },`,
			),
		);
		assert.deepEqual(built.skipped, []);
		const content = page(built, 'named');
		assert.match(
			content,
			/<button hlmBtn \[variant\]="variant" \[disabled\]="isDisabled">/,
			'the named arg is left out of the spread',
		);
		assert.match(content, /protected disabled: any = true;/);
		assert.match(content, /const \{ disabled \} = this as any;\s+this\.isDisabled = disabled;/);
	});

	it('declares an arg the story reads but never sets, so a test can still set it', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Reads: Story = {
					render: (args) => ({ props: { ...args, control: new FormControl(args.initialValue) }, template: '<b></b>' }),
				};`,
			),
		);
		assert.match(page(built, 'reads'), /protected initialValue: any = undefined;/);
		assert.match(page(built, 'reads'), /applyTestArgs\(this, \['initialValue'\]\)/);
	});

	it('uses the render on the meta for stories without their own', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Default: Story = { args: { size: 'lg' } };
				 export const Own: Story = { render: () => ({ template: '<i></i>' }) };`,
				`args: { size: 'sm' }, render: (args) => ({ props: args, template: \`<button hlmBtn \${argsToTemplate(args)}>x</button>\` }),`,
			),
		);
		assert.deepEqual(built.skipped, []);
		assert.match(page(built, 'default'), /<button hlmBtn \[size\]="size">x<\/button>/);
		assert.match(page(built, 'default'), /protected size: any = 'lg';/);
		assert.match(page(built, 'own'), /<i><\/i>/);
	});

	it('writes out markup a template builds with code that gives the same text every time', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				"export const Repeated: Story = { render: () => ({ template: `<ul>${Array.from({ length: 3 }, (_, i) => `<li>${i + 1}</li>`).join('')}</ul>` }) };",
			),
		);
		assert.deepEqual(built.skipped, []);
		assert.match(page(built, 'repeated'), /<ul>\s*<li>1<\/li>\s*<li>2<\/li>\s*<li>3<\/li>\s*<\/ul>/);
	});

	it('does not work out markup that depends on anything outside the expression', () => {
		for (const expression of ['Math.random()', 'items.map((i) => i).join("")', 'new Date().toString()']) {
			const built = buildTestPages(
				'stories/alert-dialog.stories.ts',
				story(
					'const items = ["a"]; export const S: Story = { render: () => ({ template: `<b>${' +
						expression +
						'}</b>` }) };',
				),
			);
			assert.equal(built.pages.length, 0, expression);
		}
	});

	it('leaves out stories named in the skip list and records the reason', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(`export const Stale: Story = { render: () => ({ template: '<b></b>' }) };`),
			{ Stale: 'binds to an input that no longer exists' },
		);
		assert.equal(built.pages.length, 0);
		assert.match(built.skipped[0].reasons.join(), /story-skip\.json: binds to an input/);
	});

	it('puts applicationConfig providers on the route and notes it', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(
				`export const Configured: Story = {
					decorators: [applicationConfig({ providers: [provideThing()] })],
					render: () => ({ template: '<b></b>' }),
				};`,
			),
		);
		assert.match(page(built, 'configured'), /providers: \[provideThing\(\)\],\n\};/);
		assert.match(built.pages[0].note, /applicationConfig/);
	});

	it('escapes backticks and interpolation markers that would break the generated template', () => {
		const built = buildTestPages(
			'stories/alert-dialog.stories.ts',
			story(`export const Tricky: Story = { render: () => ({ template: '<code>\`a\` \${b}</code>' }) };`),
		);
		assert.match(page(built, 'tricky'), /<code>\\`a\\` \\\$\{b\}<\/code>/);
	});

	for (const [name, source, reason] of [
		[
			'a template that interpolates anything else',
			`export const S: Story = { render: () => ({ template: \`<b>\${1 + 1}</b>\` }) };`,
			/only argsToTemplate/,
		],
		['a story without render', `export const S: Story = { args: { a: 1 } };`, /no render function/],
		[
			'a play function',
			`export const S: Story = { play: async () => {}, render: () => ({ template: '' }) };`,
			/play function/,
		],
		[
			'an unknown decorator',
			`export const S: Story = { decorators: [withTheme()], render: () => ({ template: '' }) };`,
			/decorator .* is not supported/,
		],
		[
			'a render with logic',
			`export const S: Story = { render: () => { if (Math.random()) return { template: 'a' }; return { template: '' }; } };`,
			/does not end in a single return/,
		],
		[
			'renamed destructured render parameters',
			`export const S: Story = { render: ({ size: s }) => ({ template: '' }) };`,
			/renames or defaults/,
		],
		[
			'spread in args',
			`const base = {}; export const S: Story = { args: { ...base }, render: () => ({ template: '' }) };`,
			/not `key: value`/,
		],
	]) {
		it(`skips ${name} and says why, instead of guessing`, () => {
			const built = buildTestPages('stories/alert-dialog.stories.ts', story(source));
			assert.equal(built.pages.length, 0);
			assert.equal(built.skipped.length, 1);
			assert.match(built.skipped[0].reasons.join('; '), reason);
		});
	}

	it('skips the whole file when it cannot find the meta or uses relative imports', () => {
		assert.match(
			buildTestPages('x.stories.ts', `export const A = { render: () => ({ template: '' }) };`).fileReasons.join(),
			/no meta/,
		);
		const relative = story(`export const A: Story = { render: () => ({ template: '' }) };`).replace(
			`import { HlmButton }`,
			`import { helper } from './helper';\nimport { HlmButton }`,
		);
		assert.match(buildTestPages('x.stories.ts', relative).fileReasons.join(), /relative import/);
	});

	it('gives the same output for the same input', () => {
		const source = story(`export const Default: Story = { render: () => ({ template: '<b></b>' }) };`);
		assert.deepEqual(buildTestPages('a.stories.ts', source), buildTestPages('a.stories.ts', source));
	});
});
