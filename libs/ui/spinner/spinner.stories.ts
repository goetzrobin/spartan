import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { HlmSpinnerComponent } from './helm/src';

const meta: Meta<HlmSpinnerComponent> = {
	title: 'Spinner',
	component: HlmSpinnerComponent,
	tags: ['autodocs'],
	argTypes: {
		size: {
			options: ['default', 'xs', 'sm'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmSpinnerComponent],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-spinner ${argsToTemplate(args)}></hlm-spinner>
    `,
	}),
};

export default meta;
type Story = StoryObj<HlmSpinnerComponent>;

export const Default: Story = {};
