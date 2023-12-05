import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogDescriptionDirective,
	HlmDialogFooterComponent,
	HlmDialogHeaderComponent,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnContextMenuTriggerDirective, BrnMenuDirective, BrnMenuGroupDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuDirective, HlmMenuItemDirective, HlmMenuShortcutComponent } from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-dialog-context-menu',
	standalone: true,
	imports: [
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,

		HlmDialogContentComponent,
		HlmDialogComponent,
		HlmDialogHeaderComponent,
		HlmDialogFooterComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,

		HlmLabelDirective,
		HlmButtonDirective,
		HlmInputDirective,

		BrnMenuGroupDirective,
		BrnMenuDirective,
		BrnContextMenuTriggerDirective,

		HlmMenuDirective,
		HlmMenuItemDirective,
		HlmMenuShortcutComponent,
	],
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

					<hlm-dialog #dialog="hlmDialog">
						<button inset hlm brnMenuItem brnDialogTrigger>
							Print
							<hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
						</button>
						<hlm-dialog-content *brnDialogContent="let ctx">
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
						</hlm-dialog-content>
					</hlm-dialog>
				</div>
			</div>
		</ng-template>
	`,
})
export class DialogContextMenuPreviewComponent {}

export const contextMenuCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnContextMenuTriggerDirective, BrnMenuDirective, BrnMenuGroupDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuDirective, HlmMenuItemDirective, HlmMenuShortcutComponent } from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dialog-context-menu',
  standalone: true,
  imports: [
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,

    HlmDialogContentComponent,
    HlmDialogComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,

    HlmLabelDirective,
    HlmButtonDirective,
    HlmInputDirective,

    BrnMenuGroupDirective,
    BrnMenuDirective,
    BrnContextMenuTriggerDirective,

    HlmMenuDirective,
    HlmMenuItemDirective,
    HlmMenuShortcutComponent,
  ],
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

          <hlm-dialog #dialog="hlmDialog">
            <button inset hlm brnMenuItem brnDialogTrigger>
              Print
              <hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
            </button>
            <hlm-dialog-content *brnDialogContent="let ctx">
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
            </hlm-dialog-content>
          </hlm-dialog>
        </div>
      </div>
    </ng-template>
  \`,
})
export class DialogContextMenuPreviewComponent {}
`;
