import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { HlmIconComponent } from '../icon/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { BrnCheckboxComponent, BrnCheckboxImports } from './brain/src';
import { HlmCheckboxImports } from './helm/src';

const meta: Meta<BrnCheckboxComponent> = {
	title: 'Checkbox',
	component: BrnCheckboxComponent,
	decorators: [
		moduleMetadata({
			imports: [BrnCheckboxImports, HlmCheckboxImports, HlmLabelDirective, HlmIconComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnCheckboxComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <label id='checkbox-label' class='' hlmLabel>
       <brn-checkbox id='testCheckbox' aria-checked='mixed' aria-label='test checkbox' hlm>
       <hlm-checkbox-checkicon />
      </brn-checkbox>
      </label>
    `,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: `
      <label id='checkbox-label' class='flex items-center' hlmLabel> Test Checkbox
        <brn-checkbox class='ml-2' id='testCheckbox' hlm>
          <hlm-checkbox-checkicon />
        </brn-checkbox>
      </label>
    `,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: `
      <div id='checkbox-label' class='flex items-center'>
         <label id='testCheckboxLabel' for='testCheckbox' hlmLabel> Test Checkbox </label>
         <brn-checkbox class='ml-2' id='testCheckbox' aria-labelledby='testCheckboxLabel' hlm>
           <hlm-checkbox-checkicon />
         </brn-checkbox>
      </div>
    `,
	}),
};
export const disabled: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
         <label id='checkbox-label' for='testCheckbox' hlmLabel> Test Checkbox </label>
       <brn-checkbox disabled class='ml-2' id='testCheckbox' aria-labelledby='testCheckboxLabel' hlm>
         <hlm-checkbox-checkicon />
        </brn-checkbox>
      </div>

      <div class='flex items-center pt-4'>
        <brn-checkbox disabled id='testCheckbox2' hlm>
          <hlm-checkbox-checkicon />
        </brn-checkbox>
        <label class ="ml-2" for='testCheckbox2' hlmLabel> Test Checkbox 2</label>
      </div>


      <div class='flex items-center pt-4'>
      <brn-checkbox id='testCheckbox3' hlm>
        <hlm-checkbox-checkicon />
      </brn-checkbox>
      <label class ="ml-2" for='testCheckbox3' hlmLabel> Test Checkbox 3 enabled</label>
    </div>
    `,
	}),
};

export const indeterminate: Story = {
	render: () => ({
		template: `
      <div id='checkbox-label' class='flex items-center'>
         <label id='testCheckboxLabel' for='testCheckbox' hlmLabel> Test Checkbox </label>
         <brn-checkbox hlm checked="indeterminate" class='ml-2' id='testCheckbox' aria-labelledby='testCheckboxLabel'>
           <hlm-checkbox-checkicon />
         </brn-checkbox>
      </div>
    `,
	}),
};
