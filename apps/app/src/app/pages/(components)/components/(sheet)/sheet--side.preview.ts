import { Component } from '@angular/core';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@ng-spartan/ui/sheet/brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@ng-spartan/ui/sheet/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-sheet-side',
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
    <brn-sheet closeDelay="100">
      <brn-sheet-overlay hlm />
      <div class="grid gap-2 grid-cols-2">
        <button id="left" variant="outline" brnSheetTrigger side="left" hlmBtn>left</button>
        <button id="right" variant="outline" brnSheetTrigger side="right" hlmBtn>right</button>
        <button id="top" variant="outline" brnSheetTrigger side="top" hlmBtn>top</button>
        <button id="bottom" variant="outline" brnSheetTrigger side="bottom" hlmBtn>bottom</button>
      </div>
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
export class SheetSidePreviewComponent {}

export const sideCode = `
import { Component } from '@angular/core';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@ng-spartan/ui/sheet/brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@ng-spartan/ui/sheet/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1 } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-sheet-side',
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
    <brn-sheet closeDelay="100">
      <brn-sheet-overlay hlm />
      <div class="grid gap-2 grid-cols-2">
        <button id="left" variant="outline" brnSheetTrigger side="left" hlmBtn>left</button>
        <button id="right" variant="outline" brnSheetTrigger side="right" hlmBtn>right</button>
        <button id="top" variant="outline" brnSheetTrigger side="top" hlmBtn>top</button>
        <button id="bottom" variant="outline" brnSheetTrigger side="bottom" hlmBtn>bottom</button>
      </div>
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
export class SheetSidePreviewComponent {}
`;
