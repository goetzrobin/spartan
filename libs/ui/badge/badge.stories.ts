import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmBadgeDirective } from './helm/src';

const meta: Meta<HlmBadgeDirective> = {
	title: 'Badge',
	component: HlmBadgeDirective,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			options: ['default', 'secondary', 'destructive', 'outline'],
			control: {
				type: 'select',
			},
		},
		static: {
			control: { type: 'boolean' },
		},
	},
	args: {
		static: false,
	},
	decorators: [
		moduleMetadata({
			imports: [HlmBadgeDirective],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
    <span hlmBadge ${argsToTemplate(args)}>I am a badge</span>
    `,
	}),
};

export default meta;
type Story = StoryObj<HlmBadgeDirective>;

export const Default: Story = {
	args: {
		variant: 'default',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
	},
};
