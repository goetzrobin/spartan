import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmMenuDirective, HlmMenuItemDirective, HlmMenuShortcutComponent } from '@spartan-ng/ui-menu-helm';
import { BrnContextMenuTriggerDirective, BrnMenuDirective, BrnMenuGroupDirective } from '@spartan-ng/ui-menu-brain';

@Component({
  selector: 'spartan-dialog-context-menu',
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
    HlmMenuItemDirective,
    HlmMenuShortcutComponent,
    BrnMenuGroupDirective,
    BrnMenuDirective,
    BrnContextMenuTriggerDirective,
    HlmMenuDirective,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: `
    <div
      [brnCtxMenuTriggerFor]="menu"
      class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </div>

    <ng-template #menu>
      <div hlm brnMenu class="w-64">
        <div brnMenuGroup>
          <button inset hlm brnMenuItem>
            Save
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button disabled inset hlm brnMenuItem>
            Archive
            <hlm-menu-shortcut>⌘A</hlm-menu-shortcut>
          </button>

          <brn-dialog #dialog="brnDialog" closeDelay="100">
            <brn-dialog-overlay hlm />
            <button inset hlm brnMenuItem brnDialogTrigger>
              Print
              <hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
            </button>
            <div hlmDialogContent *brnDialogContent="let ctx">
              <hlm-dialog-header>
                <h3 brnDialogTitle hlm>Print this page</h3>
                <p brnDialogDescription hlm>
                  Are you sure you want to print this page? Only print if absolutely necessary! The less we print, the
                  less paper we need, the better it is for our environment!
                </p>
              </hlm-dialog-header>
              <hlm-dialog-footer>
                <button hlmBtn variant="ghost" (click)="ctx.close()">Cancel</button>
                <button hlmBtn>Print</button>
              </hlm-dialog-footer>
              <button brnDialogClose hlm>
                <span class="sr-only">Close</span>
                <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
              </button>
            </div>
          </brn-dialog>
        </div>
      </div>
    </ng-template>
  `,
})
export class DialogContextMenuPreviewComponent {}

export const contextMenuCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmMenuDirective, HlmMenuItemDirective, HlmMenuShortcutComponent } from '@spartan-ng/ui-menu-helm';
import { BrnContextMenuTriggerDirective, BrnMenuDirective, BrnMenuGroupDirective } from '@spartan-ng/ui-menu-brain';

@Component({
  selector: 'spartan-dialog-context-menu',
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
    HlmMenuItemDirective,
    HlmMenuShortcutComponent,
    BrnMenuGroupDirective,
    BrnMenuDirective,
    BrnContextMenuTriggerDirective,
    HlmMenuDirective,
  ],
  providers: [provideIcons({ radixCross1 })],
  template: \`
    <div
      [brnCtxMenuTriggerFor]="menu"
      class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </div>

    <ng-template #menu>
      <div hlm brnMenu class="w-64">
        <div brnMenuGroup>
          <button inset hlm brnMenuItem>
            Save
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button disabled inset hlm brnMenuItem>
            Archive
            <hlm-menu-shortcut>⌘A</hlm-menu-shortcut>
          </button>

          <brn-dialog #dialog="brnDialog" closeDelay="100">
            <brn-dialog-overlay hlm />
            <button inset hlm brnMenuItem brnDialogTrigger>
              Print
              <hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
            </button>
            <div hlmDialogContent *brnDialogContent="let ctx">
              <hlm-dialog-header>
                <h3 brnDialogTitle hlm>Print this page</h3>
                <p brnDialogDescription hlm>
                  Are you sure you want to print this page? Only print if absolutely necessary! The less we print, the
                  less paper we need, the better it is for our environment!
                </p>
              </hlm-dialog-header>
              <hlm-dialog-footer>
                <button hlmBtn variant="ghost" (click)="ctx.close()">Cancel</button>
                <button hlmBtn>Print</button>
              </hlm-dialog-footer>
              <button brnDialogClose hlm>
                <span class="sr-only">Close</span>
                <hlm-icon class="flex h-4 w-4" size="100%" name="radixCross1" />
              </button>
            </div>
          </brn-dialog>
        </div>
      </div>
    </ng-template>
  \`,
})
export class DialogContextMenuPreviewComponent {}
`;
