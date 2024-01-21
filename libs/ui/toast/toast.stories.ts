import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { BrnToasterComponent } from './brain/src';

const meta: Meta<BrnToasterComponent> = {
	title: 'Toast',
	component: BrnToasterComponent,
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
			imports: [BrnToasterComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnToasterComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <div>
      Test
    </div>
       `,
	}),
};
