import { FormsModule } from '@angular/forms';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmInputDirective } from '../input/helm/src';
import { BrnLabelDirective } from './brain/src';
import { HlmLabelDirective } from './helm/src';

const meta: Meta<{}> = {
	title: 'Label',
	argTypes: {
		id: {
			control: 'text',
		},
		value: {
			control: 'text',
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmInputDirective, HlmLabelDirective, BrnLabelDirective, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
	render: (args) => ({
		props: args,
		template: `
    <label hlmLabel ${argsToTemplate(args)}>E-Mail
        <input class='w-80' hlmInput type='email' placeholder='Email'/>
    </label>
    `,
	}),
};

export const InputRequired: Story = {
	render: (args) => ({
		props: args,
		template: `
    <label hlmLabel ${argsToTemplate(args)}>E-Mail *
        <input [(ngModel)]="value" class='w-80' hlmInput type='email' placeholder='Email *' required/>
    </label>
    `,
	}),
};
