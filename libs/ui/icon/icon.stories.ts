import * as lucide from '@ng-icons/lucide';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from './helm/src';

const meta: Meta<HlmIconComponent> = {
	title: 'Icon',
	component: HlmIconComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmIconComponent],
			providers: [provideIcons(lucide)],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmIconComponent>;

export const Default: Story = {
	args: {
		name: 'lucideCheck',
		size: 'sm',
		color: 'red',
		class: '',
		strokeWidth: 1,
	},
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'base', 'lg', 'xl', 'none', '2rem', '25px', '10'] },
		name: { control: 'select', options: Object.keys(lucide) },
		color: { control: 'color' },
	},
	render: ({ ...args }) => ({
		props: args,
		template: `<hlm-icon ${argsToTemplate(args)} />`,
	}),
};

export const Tailwind: Story = {
	args: {
		class: 'text-red-600 text-5xl',
		name: 'lucideCheck',
	},
	argTypes: {
		name: { control: 'select', options: Object.keys(lucide) },
	},
	render: ({ ...args }) => ({
		props: args,
		template: `<hlm-icon ${argsToTemplate(args)} />`,
	}),
};
