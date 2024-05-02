import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as lucide from '@ng-icons/lucide';
import { lucideHome } from '@ng-icons/lucide';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmIconComponent, type IconSize, provideIcons } from './helm/src';

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

@Component({
	selector: 'icon-dynamic-story',
	standalone: true,
	imports: [FormsModule, HlmIconComponent],
	providers: [provideIcons({ lucideHome })],
	template: /* HTML */ `
		<hlm-icon name="lucideHome" [size]="size()" />
		<div>Bound property value: {{size()}}</div>

		<div class="flex flex-row gap-x-2">
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="xs" />
				<span>XS</span>
			</label>
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="sm" />
				<span>SM</span>
			</label>
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="base" />
				<span>Base</span>
			</label>
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="lg" />
				<span>LG</span>
			</label>
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="xl" />
				<span>XL</span>
			</label>
			<label>
				<input type="radio" name="iconSize" [ngModel]="size()" (ngModelChange)="size.set($event)" value="none" />
				<span>None</span>
			</label>
		</div>
	`,
})
class IconDynamicStory {
	protected size = signal<IconSize>('base');
}

export const Dynamic: Story = {
	decorators: [
		moduleMetadata({
			imports: [IconDynamicStory],
		}),
	],
	render: () => ({
		template: '<icon-dynamic-story/>',
	}),
};
