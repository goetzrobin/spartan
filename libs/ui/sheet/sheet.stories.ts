import { radixCross1 } from '@ng-icons/radix-icons';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { BrnSheetImports } from './brain/src';
import { HlmSheetImports } from './helm/src';

export type SheetProps = { side: 'top' | 'bottom' | 'left' | 'right' };
const meta: Meta<SheetProps> = {
	title: 'Sheet',
	argTypes: {
		side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
	},
	decorators: [
		moduleMetadata({
			imports: [BrnSheetImports, HlmSheetImports, HlmButtonDirective, HlmInputDirective, HlmIconComponent],
			providers: [provideIcons({ radixCross1 })],
		}),
	],
};

export default meta;
type Story = StoryObj<SheetProps>;

export const Default: Story = {
	args: { side: 'left' },
	render: ({ side }) => ({
		props: { side },
		template: `
    <brn-sheet [side]='side' closeDelay='100'>
    <brn-sheet-overlay hlm/>
    <button id='edit-profile' variant='outline' brnSheetTrigger hlmBtn>Edit Profile</button>
    <div hlmSheetContent *brnSheetContent='let ctx'>
         <hlm-sheet-header>
          <h3 brnSheetTitle hlm>Edit Profile</h3>
          <p brnSheetDescription hlm>
          Make changes to your profile here. Click save when you're done.
          </p>
        </hlm-sheet-header>
                <div class='grid gap-4 py-4'>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='name' class='text-right'>
              Name
            </label>
            <input hlmInput id='name' value='Pedro Duarte' class='col-span-3' />
          </div>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='username' class='text-right'>
              Username
            </label>
            <input hlmInput id='username' value='@peduarte' class='col-span-3' />
          </div>
        </div>
        <hlm-sheet-footer>
          <button hlmBtn type='submit'>Save Changes</button>
        </hlm-sheet-footer>
        <button brnSheetClose hlm>
        <span class='sr-only'>Close</span>
        <hlm-icon class='flex h-4 w-4' size='100%' name='radixCross1'/>
        </button>
    </div>
    </brn-sheet>
    `,
	}),
};
