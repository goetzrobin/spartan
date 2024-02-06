import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { BrnToasterDemoComponent } from './brn-toaster-demo.component';

const meta: Meta<BrnToasterDemoComponent> = {
	title: 'Toast',
	component: BrnToasterDemoComponent,
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
			imports: [BrnToasterDemoComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnToasterDemoComponent>;

export const Default: Story = {
	render: () => ({
		template: `
	<brn-toaster-demo/>
       `,
	}),
};
