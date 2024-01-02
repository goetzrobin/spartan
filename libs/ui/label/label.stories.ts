import { FormsModule } from '@angular/forms';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from './helm/src';

const meta: Meta<HlmLabelDirective> = {
	title: 'Label',
	component: HlmLabelDirective,
	tags: ['autodocs'],
	args: {
		variant: 'default',
		error: 'auto',
	},
	argTypes: {
		variant: {
			options: ['default'],
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
			imports: [HlmInputDirective, HlmLabelDirective, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmLabelDirective>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <label hlmLabel>E-Mail
        <input class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    </label>
    `,
	}),
};

export const InputRequired: Story = {
	render: ({ ...args }) => ({
		props: { ...args, value: '' },
		template: `
    <label hlmLabel>E-Mail *
        <input [(ngModel)]="value" class='w-80' hlmInput ${argsToTemplate(
					args,
				)} type='email' placeholder='Email *' required/>
    </label>
    `,
	}),
};
