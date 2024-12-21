import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { HlmSeparatorDirective } from '../separator/helm/src';
import { HlmScrollAreaDirective } from './helm/src';

@Component({
	selector: 'scroll-area-stories',
	standalone: true,
	imports: [NgFor, HlmSeparatorDirective, HlmScrollAreaDirective, NgScrollbarModule],
	template: `
		<ng-scrollbar hlm class="border-border h-72 w-48 rounded-md border">
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
				<div class="text-sm" *ngFor="let tag of tags">
					{{ tag }}
					<div hlmSeparator class="my-2"></div>
				</div>
			</div>
		</ng-scrollbar>
	`,
})
class ScrollAreaStoriesComponent {
	tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
}

const meta: Meta<NgScrollbar> = {
	title: 'Scroll Area',
	component: NgScrollbar,
	tags: ['autodocs'],
	args: {
		track: 'all',
		visibility: 'native',
	} as any, // this is required as storybook isn't inferring types from signals
	argTypes: {
		track: {
			options: ['vertical', 'horizontal', 'all'],
			control: {
				type: 'select',
			},
			table: {
				defaultValue: { summary: 'all' },
			},
		},
		visibility: {
			options: ['hover', 'always', 'native'],
			control: {
				type: 'select',
			},
			table: {
				defaultValue: { summary: 'native' },
			},
		},
	} as any,
	decorators: [
		moduleMetadata({
			imports: [HlmScrollAreaDirective, NgScrollbarModule, ScrollAreaStoriesComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmScrollAreaDirective>;

export const Default: Story = {
	render: () => ({
		template: `
       <scroll-area-stories/>
    `,
	}),
};

export const Vertical: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
        <ng-scrollbar hlm ${argsToTemplate(args)} class="border w-72 rounded-md border-border">
        <div class='p-6 whitespace-nowrap'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto,<br>
        asperiores beatae consequuntur dolor ducimus et exercitationem facilis fugiat magni<br>
        nisi officiis quibusdam rem repellat reprehenderit totam veritatis voluptatibus! Nobis.
        </div>
        </ng-scrollbar>`,
	}),
};
