import type { Direction } from '@angular/cdk/bidi';
import { signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BrnSliderImports } from './brain/src';
import { HlmSliderImports } from './helm/src';

interface BrnSliderStoryArgs {
	disabled: boolean;
	min: number;
	max: number;
	step: number;
	dir: Direction;
	ariaLabel: string;
	showTickMarks: boolean;
}

const meta: Meta<BrnSliderStoryArgs> = {
	title: 'Slider',
	tags: ['autodocs'],
	args: {
		disabled: false,
		dir: 'ltr',
		ariaLabel: 'fallback-label',
	},
	argTypes: {
		dir: { control: 'radio', options: ['ltr', 'rtl'] },
	},
	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmSliderImports, BrnSliderImports],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSliderStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>
		`,
	}),
};

export const Min: Story = {
	args: {
		min: 10,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const Max: Story = {
	args: {
		max: 75,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const MinMax: Story = {
	args: {
		min: 10,
		max: 90,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const Step: Story = {
	args: {
		step: 5,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const TickMarks: Story = {
	args: {
		step: 5,
		showTickMarks: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)}>
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const AriaLabelledby: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<label hlmLabel #sliderLabel id="slider-label">Slider with label</label>
			<hlm-slider ${argsToTemplate(args, { exclude: ['ariaLabel'] })} [label]="sliderLabel">
				<hlm-slider-track>
					<input id="slider" hlmSliderInput [(ngModel)]="value" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>

			<div>{{value}}</div>
		`,
	}),
};

export const TemplateDrivenForm: Story = {
	render: (args) => ({
		props: { ...args, temperature: signal('0') },
		template: /* HTML */ `
			<form ngForm>
				<div>
					<pre>{{temperature()}}</pre>
				</div>
				<hlm-slider ${argsToTemplate(args)}>
					<hlm-slider-track>
						<input hlmSliderInput [(ngModel)]="temperature" name="temperature" />
					</hlm-slider-track>
					<hlm-slider-thumb></hlm-slider-thumb>
				</hlm-slider>

				<button (click)="temperature.set(25)">Change temperature value</button>
			</form>
		`,
	}),
};

export const TemplateDrivenFormWithInitialValue: Story = {
	render: (args) => ({
		props: { ...args, temperature: signal(12) },
		template: /* HTML */ `
			<form ngForm>
				<div>
					<pre>{{temperature()}}</pre>
				</div>
				<hlm-slider ${argsToTemplate(args)}>
					<hlm-slider-track>
						<input hlmSliderInput [(ngModel)]="temperature" name="temperature" />
					</hlm-slider-track>
					<hlm-slider-thumb></hlm-slider-thumb>
				</hlm-slider>

				<button (click)="temperature.set(25)">Change temperature value</button>
			</form>
		`,
	}),
};

export const ReactiveFormControl: Story = {
	render: (args) => ({
		props: { ...args, temperatureGroup: new FormGroup({ temperature: new FormControl() }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ temperatureGroup.controls.temperature.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="temperatureGroup">
				<hlm-slider ${argsToTemplate(args)}>
					<hlm-slider-track>
						<input hlmSliderInput formControlName="temperature" />
					</hlm-slider-track>
					<hlm-slider-thumb></hlm-slider-thumb>
				</hlm-slider>
			</form>
		`,
	}),
};

export const ReactiveFormControlWithInitialValue: Story = {
	render: (args) => ({
		props: { ...args, temperatureGroup: new FormGroup({ temperature: new FormControl(26) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ temperatureGroup.controls.temperature.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="temperatureGroup">
				<hlm-slider ${argsToTemplate(args)}>
					<hlm-slider-track>
						<input hlmSliderInput formControlName="temperature" />
					</hlm-slider-track>
					<hlm-slider-thumb></hlm-slider-thumb>
				</hlm-slider>
			</form>
		`,
	}),
};
