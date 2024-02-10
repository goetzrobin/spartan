import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { HlmToasterDemoComponent } from './hlm-toaster-demo.component';

const meta: Meta<HlmToasterDemoComponent> = {
	title: 'Toast',
	component: HlmToasterDemoComponent,
	tags: ['autodocs'],
	// args: {
	// 	orientation: 'horizontal',
	// 	decorative: false,
	// },
	// argTypes: {
	// 	orientation: {
	// 		options: ['horizontal', 'vertical'],
	// 		control: {
	// 			type: 'select',
	// 		},
	// 	},
	// 	decorative: {
	// 		control: {
	// 			type: 'boolean',
	// 		},
	// 	},
	// },
	decorators: [
		moduleMetadata({
			imports: [HlmToasterDemoComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToasterDemoComponent>;

export const Default: Story = {
	render: () => ({
		template: `
	<hlm-toaster-demo/>
       `,
	}),
};
