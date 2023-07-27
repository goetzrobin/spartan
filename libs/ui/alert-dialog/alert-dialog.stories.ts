import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { BrnAlertDialogImports } from './brain/src';
import { HlmAlertDialogImports } from './helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '../button/helm/src';

const meta: Meta<{}> = {
  title: 'Alert Dialog',
  decorators: [
    moduleMetadata({
      imports: [BrnAlertDialogImports, HlmAlertDialogImports, HlmButtonDirective, HlmIconComponent],
      providers: [provideIcons({ radixCross1 })],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <brn-alert-dialog closeDelay='100'>
    <brn-alert-dialog-overlay hlm/>
    <button id='edit-profile' variant='outline' brnAlertDialogTrigger hlmBtn>Delete Account</button>
    <div hlmAlertDialogContent *brnAlertDialogContent='let ctx'>
         <hlm-alert-dialog-header>
          <h3 brnAlertDialogTitle hlm>Are you absolutely sure?</h3>
          <p brnAlertDialogDescription hlm>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel (click)='ctx.close()' >Cancel</button>
          <button hlmAlertDialogAction type='submit'>Delete account</button>
        </hlm-alert-dialog-footer>
        <button brnAlertDialogClose hlm>
        <span class='sr-only'>Close</span>
        <hlm-icon class='flex h-4 w-4' size='100%' name='radixCross1'/>
        </button>
    </div>
    </brn-alert-dialog>
    `,
  }),
};
