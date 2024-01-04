import * as radixIcons from '@ng-icons/radix-icons';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from './helm/src';

const meta: Meta<HlmIconComponent> = {
	title: 'Icon',
	component: HlmIconComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmIconComponent],
			providers: [provideIcons(radixIcons)],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmIconComponent>;

export const Default: Story = {
	args: {
		name: 'radixCheck',
		size: 'sm',
		color: 'red',
		class: '',
		strokeWidth: 1,
	},
	argTypes: {
		size: { control: 'select', options: ['xs', 'sm', 'base', 'lg', 'xl', 'none', '2rem', '25px', '10'] },
		name: { control: 'select', options: Object.keys(radixIcons) },
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
		name: 'radixCheck',
	},
	argTypes: {
		name: { control: 'select', options: Object.keys(radixIcons) },
	},
	render: ({ ...args }) => ({
		props: args,
		template: `<hlm-icon ${argsToTemplate(args)} />`,
	}),
};
