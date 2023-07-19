import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import {
  BrnDialogCloseDirective,
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogDescriptionDirective,
  BrnDialogOverlayComponent,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui/dialog/brain';
import {
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui/dialog/helm';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';

@Component({
  selector: 'spartan-dialog-preview',
  standalone: true,
  imports: [
    BrnDialogComponent,
    BrnDialogOverlayComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    BrnDialogCloseDirective,
    BrnDialogTitleDirective,
    BrnDialogDescriptionDirective,
    HlmDialogOverlayDirective,
    HlmDialogContentDirective,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmDialogCloseDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: `
    <brn-dialog closeDelay="100">
      <brn-dialog-overlay hlm />
      <button id="edit-profile" brnDialogTrigger hlmBtn>Edit Profile</button>
      <div hlmDialogContent class="sm:max-w-[425px]" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 brnDialogTitle hlm>Edit profile</h3>
          <p brnDialogDescription hlm>Make changes to your profile here. Click save when you're done.</p>
        </hlm-dialog-header>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label hlmLabel for="name" class="text-right"> Name </label>
            <input hlmInput id="name" value="Pedro Duarte" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label hlmLabel for="username" class="text-right"> Username </label>
            <input hlmInput id="username" value="@peduarte" class="col-span-3" />
          </div>
        </div>
        <hlm-dialog-footer>
          <button hlmBtn type="submit">Save changes</button>
        </hlm-dialog-footer>
        <button brnDialogClose hlm>
          <span class="sr-only">Close</span>
          <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
        </button>
      </div>
    </brn-dialog>
  `,
})
export class DialogPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import {
  BrnDialogCloseDirective,
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogDescriptionDirective,
  BrnDialogOverlayComponent,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui/dialog/brain';
import {
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui/dialog/helm';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';

@Component({
  selector: 'spartan-dialog-preview',
  standalone: true,
  imports: [
    BrnDialogComponent,
    BrnDialogOverlayComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    BrnDialogCloseDirective,
    BrnDialogTitleDirective,
    BrnDialogDescriptionDirective,
    HlmDialogOverlayDirective,
    HlmDialogContentDirective,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmDialogCloseDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: \`
    <brn-dialog closeDelay='100'>
      <brn-dialog-overlay hlm />
      <button id='edit-profile' brnDialogTrigger hlmBtn>Edit Profile</button>
      <div hlmDialogContent class='sm:max-w-[425px]' *brnDialogContent='let ctx'>
        <hlm-dialog-header>
          <h3 brnDialogTitle hlm>Edit profile</h3>
          <p brnDialogDescription hlm>Make changes to your profile here. Click save when you're done.</p>
        </hlm-dialog-header>
        <div class='grid gap-4 py-4'>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='name' class='text-right'> Name </label>
            <input hlmInput id='name' value='Pedro Duarte' class='col-span-3' />
          </div>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='username' class='text-right'> Username </label>
            <input hlmInput id='username' value='@peduarte' class='col-span-3' />
          </div>
        </div>
        <hlm-dialog-footer>
          <button hlmBtn type='submit'>Save changes</button>
        </hlm-dialog-footer>
        <button brnDialogClose hlm>
          <span class='sr-only'>Close</span>
          <hlm-icon class='flex h-4 w-4' size='100%' name='radixCross1' />
        </button>
      </div>
    </brn-dialog>
  \`,
})
export class DialogPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnDialogCloseDirective,
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogDescriptionDirective,
  BrnDialogOverlayComponent,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui/dialog/brain';
import {
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui/dialog/helm';
`;

export const defaultSkeleton = `
<brn-dialog closeDelay="100">
  <brn-dialog-overlay hlm />
  <button brnDialogTrigger hlmBtn>Edit Profile</button>
  <div hlmDialogContent *brnDialogContent="let ctx">
    <hlm-dialog-header>
      <h3 brnDialogTitle hlm>Edit profile</h3>
      <p brnDialogDescription hlm>Make changes to your profile here. Click save when you're done.</p>
    </hlm-dialog-header>
    <hlm-dialog-footer>
      <button hlmBtn type="submit">Save changes</button>
    </hlm-dialog-footer>
    <button brnDialogClose hlm>
      <span class="sr-only">Close</span>
      <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
    </button>
  </div>
</brn-dialog>
`;
