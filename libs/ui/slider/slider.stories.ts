import { FormsModule } from "@angular/forms";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";
import { argsToTemplate } from "@storybook/angular";
import { BrnSliderImports } from "./brain/src";
import { HlmSliderImports } from "./helm/src";

interface BrnSliderStoryArgs {	
	disabled: boolean;	
	min: number;
	max: number;
};

const meta: Meta<BrnSliderStoryArgs> = {
	title: 'Slider',
	tags: ['autodocs'],
	args: {
		disabled: false
	},
    decorators: [
		moduleMetadata({
			imports: [FormsModule, HlmSliderImports, BrnSliderImports],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSliderStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `			
			<hlm-slider>                			
				<hlm-slider-track>
					<input hlmSliderInput [(ngModel)]="value1" />						
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>
			

			<div>{{value1}}</div>

            <div><input type="number" [(ngModel)]="value1" /></div>
			<button (click)="value1 = 25">Change slider value</button>
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


