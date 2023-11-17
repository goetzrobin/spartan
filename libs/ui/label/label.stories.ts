import { FormsModule } from '@angular/forms';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from './helm/src';

const meta: Meta<{}> = {
	title: 'Label',
	decorators: [
		moduleMetadata({
			imports: [HlmInputDirective, HlmLabelDirective, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
	render: () => ({
		template: `
    <label hlmLabel>E-Mail
        <input class='w-80' hlmInput type='email' placeholder='Email'/>
    </label>
    `,
	}),
};

export const InputRequired: Story = {
	render: () => ({
		props: { value: '' },
		template: `
    <label hlmLabel>E-Mail *
        <input [(ngModel)]="value" class='w-80' hlmInput type='email' placeholder='Email *' required/>
    </label>
    `,
	}),
};
