import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as lucide from '@ng-icons/lucide';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmInputDirective, HlmInputModule } from './helm/src';

const meta: Meta<HlmInputDirective> = {
	title: 'Input',
	component: HlmInputDirective,
	tags: ['autodocs'],
	args: {
		size: 'default',
		error: 'auto',
	},
	argTypes: {
		size: {
			options: ['default', 'sm', 'lg'],
			control: {
				type: 'select',
			},
		},
		error: {
			options: ['auto', 'true'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmInputModule, HlmLabelDirective, HlmButtonDirective, FormsModule, HlmIconComponent],
			providers: [provideIcons(lucide)],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmInputDirective>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const File: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label hlmLabel for="picture">Picture</label>
      <input class='w-80' hlmInput ${argsToTemplate(args)} id="picture" type="file" />
    </div>`,
	}),
};

export const Disabled: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' disabled class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const Required: Story = {
	render: ({ ...args }) => ({
		props: { value: '', ...args },
		template: `
    <input aria-label='Email *' [(ngModel)]="value" class='w-80' hlmInput ${argsToTemplate(
			args,
		)} type='email' required placeholder='Email *'/>
    `,
	}),
};

export const Error: Story = {
	render: ({ ...args }) => ({
		props: { ...args, error: 'true' },
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email' />
    `,
	}),
};

export const WithButton: Story = {
	name: 'With Button',
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="flex w-full max-w-sm items-center space-x-2">
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    <button hlmBtn>Subscribe</button>
    </div>
    `,
	}),
};

@Component({
	selector: 'form-field-story',
	standalone: true,
	imports: [HlmInputModule, HlmLabelDirective, HlmButtonDirective, HlmIconComponent, NgIf],
	providers: [provideIcons(lucide)],
	template: /* html */ `
		<hlm-input-form-field class="w-80">
			<hlm-icon size="sm" name="lucideKey" hlmInputPrefix />
			<label hlmLabel for="password">Password</label>
			<input
				class="w-full pl-11"
				maxlength="24"
				hlmInput
				placeholder="password"
				value="mystrongpassword"
				name="password"
				[type]="showPassword ? 'text' : 'password'"
			/>
			<button class="p-0" variant="link" size="sm" hlmBtn hlmInputSuffix (click)="toggleShowPassword()">
				<ng-container *ngIf="showPassword; else hidePassword">Hide</ng-container>
				<ng-template #hidePassword>Show</ng-template>
			</button>
		</hlm-input-form-field>
	`,
})
class FormFieldStory {
	showPassword = false;
	toggleShowPassword() {
		this.showPassword = !this.showPassword;
	}
}

export const FormField: Story = {
	render: ({ ...args }) => ({
		moduleMetadata: {
			imports: [FormFieldStory],
		},
		props: args,
		template: `<form-field-story></form-field-story>`,
	}),
};
