import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { HlmIconComponent } from '../icon/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmCheckboxComponent, HlmCheckboxImports } from './helm/src';

const meta: Meta<HlmCheckboxComponent> = {
	title: 'Checkbox',
	component: HlmCheckboxComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCheckboxImports, HlmLabelDirective, HlmIconComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCheckboxComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <label id='checkbox-label' class='' hlmLabel> Test Checkbox
       <hlm-checkbox id='testCheckbox' aria-checked='mixed' aria-label='test checkbox'/>
    </label>
    `,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: `
      <label id='checkbox-label' class='flex items-center' hlmLabel> Test Checkbox
        <hlm-checkbox class='ml-2' id='testCheckbox'/>
      </label>
    `,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: `
      <div id='checkbox-label' class='flex items-center'>
         <label id='testCheckbox' for='testCheckboxAria' hlmLabel> Test Checkbox </label>
         <hlm-checkbox class='ml-2' id='testCheckboxAria' aria-labelledby='testCheckbox'/>
      </div>
    `,
	}),
};
export const disabled: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
         <label id='checkbox-label' for='testCheckboxDis1' hlmLabel> Test Checkbox </label>
       <hlm-checkbox disabled class='ml-2' id='testCheckboxDis1' aria-labelledby='testCheckbox'/>
      </div>

      <div class='flex items-center pt-4'>
        <hlm-checkbox disabled id='testCheckboxDis2'/>
        <label class ="ml-2" for='testCheckboxDis2' hlmLabel> Test Checkbox 2</label>
      </div>

      <div class='flex items-center pt-4'>
      <hlm-checkbox id='testCheckboxDis3' />
      <label class ="ml-2" for='testCheckboxDis3' hlmLabel> Test Checkbox 3 enabled</label>
    </div>
    `,
	}),
};

export const indeterminate: Story = {
	render: () => ({
		template: `
      <div id='checkbox-label' class='flex items-center'>
         <label id='testCheckbox' for='testCheckboxIndeterminate' hlmLabel> Test Checkbox </label>
         <hlm-checkbox checked="indeterminate" class='ml-2' id='testCheckboxIndeterminate' aria-labelledby='testCheckbox'/>
      </div>
    `,
	}),
};
