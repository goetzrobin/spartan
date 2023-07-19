import { Component } from '@angular/core';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui/sheet/brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui/sheet/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';

@Component({
  selector: 'spartan-sheet-preview',
  standalone: true,
  imports: [
    BrnSheetComponent,
    BrnSheetOverlayComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    BrnSheetCloseDirective,
    BrnSheetTitleDirective,
    BrnSheetDescriptionDirective,
    HlmSheetOverlayDirective,
    HlmSheetContentDirective,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmSheetCloseDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    HlmLabelDirective,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: `
    <brn-sheet side="right" closeDelay="100">
      <brn-sheet-overlay hlm />
      <button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Edit Profile</button>
      <div hlmSheetContent *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 brnSheetTitle hlm>Edit Profile</h3>
          <p brnSheetDescription hlm>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
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
        <hlm-sheet-footer>
          <button hlmBtn type="submit">Save Changes</button>
        </hlm-sheet-footer>
        <button brnSheetClose hlm>
          <span class="sr-only">Close</span>
          <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
        </button>
      </div>
    </brn-sheet>
  `,
})
export class SheetPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui/sheet/brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui/sheet/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';

@Component({
  selector: 'spartan-sheet-preview',
  standalone: true,
  imports: [
    BrnSheetComponent,
    BrnSheetOverlayComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    BrnSheetCloseDirective,
    BrnSheetTitleDirective,
    BrnSheetDescriptionDirective,
    HlmSheetOverlayDirective,
    HlmSheetContentDirective,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmSheetCloseDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconComponent,
    HlmLabelDirective,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: \`
    <brn-sheet side="right" closeDelay="100">
      <brn-sheet-overlay hlm />
      <button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Edit Profile</button>
      <div hlmSheetContent *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 brnSheetTitle hlm>Edit Profile</h3>
          <p brnSheetDescription hlm>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
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
        <hlm-sheet-footer>
          <button hlmBtn type="submit">Save Changes</button>
        </hlm-sheet-footer>
        <button brnSheetClose hlm>
          <span class="sr-only">Close</span>
          <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
        </button>
      </div>
    </brn-sheet>
  \`,
})
export class SheetPreviewComponent {}

`;

export const defaultImports = `
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui/sheet/brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui/sheet/helm';
`;
export const defaultSkeleton = `
<brn-sheet>
    <brn-sheet-overlay hlm />
    <button brnSheetTrigger>Edit Profile</button>
    <div hlmSheetContent *brnSheetContent="let ctx">
        <hlm-sheet-header>
            <h3 brnSheetTitle hlm>Edit Profile</h3>
            <p brnSheetDescription hlm>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
    </div>
</brn-sheet>
`;
