import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { HlmLabelDirective } from '../label/helm/src';
import { BrnSwitchComponent, BrnSwitchImports } from './brain/src';
import { HlmSwitchImports } from './helm/src';

const meta: Meta<BrnSwitchComponent> = {
	title: 'Switch',
	component: BrnSwitchComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnSwitchImports, HlmSwitchImports, HlmLabelDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSwitchComponent>;

export const Default: Story = {
	render: () => ({
		template: `
       <hlm-switch id='testSwitch' aria-label='test switch' />
    `,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: `
      <label class='flex items-center' hlmLabel> Test Switch
        <hlm-switch class='ml-2' id='testSwitch' />
      </label>
    `,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
        <label id='testSwitchLabel' for='testSwitch' hlmLabel> Test Switch </label>
        <hlm-switch class='ml-2' id='testSwitch' aria-labelledby='testSwitchLabel' />
      </div>
    `,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
         <label id='testSwitchLabel' for='testSwitch' hlmLabel> Test Switch </label>
       <hlm-switch disabled="true" class='ml-2' id='testSwitch' aria-labelledby='testSwitchLabel' />
      </div>
    `,
	}),
};
