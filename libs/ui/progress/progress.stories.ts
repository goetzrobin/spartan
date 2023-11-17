import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmLabelDirective } from '../label/helm/src';
import { BrnProgressImports } from './brain/src';
import { HlmProgressImports } from './helm/src';

const meta: Meta<{ value: number }> = {
	title: 'Progress',
	decorators: [
		moduleMetadata({
			imports: [BrnProgressImports, HlmProgressImports, HlmLabelDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<{ value: number }>;

export const Default: Story = {
	args: {
		value: 30,
	},
	render: ({ value }) => ({
		props: { value },
		template: `
<div class='max-w-xl'>
    <h2 hlmLabel id='loading'>Loading (not started)</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='loading' hlm value='0'>
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h2 hlmLabel id='loading-started'>Loading (started)</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='loading-started' hlm [value]='value'>
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h2 hlmLabel id='indeterminate'>Indeterminate</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='indeterminate' hlm [value]='null'>
      <brn-progress-indicator hlm/>
    </brn-progress>

    <h2 hlmLabel id='complete'>Complete</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='complete' hlm value='100'>
      <brn-progress-indicator hlm/>
    </brn-progress>
    </div>
    `,
	}),
};
