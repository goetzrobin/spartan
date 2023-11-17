import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixReset } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import {
	BrnMenuDirective,
	BrnMenuGroupDirective,
	BrnMenuItemCheckboxDirective,
	BrnMenuItemDirective,
	BrnMenuItemRadioDirective,
	BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
	HlmMenuDirective,
	HlmMenuItemCheckComponent,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemRadioComponent,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-dropdown-with-state',
	standalone: true,
	imports: [
		BrnMenuDirective,
		BrnMenuItemDirective,
		BrnMenuTriggerDirective,
		BrnMenuGroupDirective,
		BrnMenuItemRadioDirective,
		BrnMenuItemCheckboxDirective,

		HlmMenuDirective,
		HlmSubMenuDirective,
		HlmMenuItemDirective,
		HlmMenuItemSubIndicatorComponent,
		HlmMenuLabelComponent,
		HlmMenuShortcutComponent,
		HlmMenuSeparatorComponent,
		HlmMenuItemIconDirective,

		HlmButtonDirective,
		HlmIconComponent,

		NgFor,
		HlmMenuItemCheckComponent,
		HlmMenuItemRadioComponent,
	],
	providers: [provideIcons({ radixReset })],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button hlmBtn variant="outline" align="center" [brnMenuTriggerFor]="menu">Open</button>
		</div>
		<ng-template #menu>
			<div hlm brnMenu class="w-56">
				<div brnMenuGroup>
					<hlm-menu-label>Appearance</hlm-menu-label>

					<button hlm brnMenuItemCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
						<hlm-menu-item-check />
						<span>Panel</span>
					</button>

					<button
						hlm
						brnMenuItemCheckbox
						disabled
						[checked]="isActivityBar"
						(triggered)="isActivityBar = !isActivityBar"
					>
						<hlm-menu-item-check />
						<span>Activity Bar</span>
					</button>

					<button hlm brnMenuItemCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
						<hlm-menu-item-check />
						<span>Status Bar</span>
					</button>
				</div>

				<hlm-menu-separator />

				<hlm-menu-label>Panel Position</hlm-menu-label>

				<div brnMenuGroup>
					<button
						hlm
						brnMenuItemRadio
						*ngFor="let size of panelPositions"
						[checked]="size === selectedPosition"
						(triggered)="selectedPosition = size"
					>
						<hlm-menu-item-radio />
						<span>{{ size }}</span>
					</button>
				</div>

				<hlm-menu-separator />

				<button hlm brnMenuItem (triggered)="reset()">
					<hlm-icon name="radixReset" hlmMenuIcon />
					Reset
				</button>
			</div>
		</ng-template>
	`,
})
export class DropdownWithStatePreviewComponent {
	isStatusBar = false;
	isPanel = false;
	isActivityBar = false;

	panelPositions = ['Top', 'Bottom', 'Right', 'Left'] as const;
	selectedPosition: (typeof this.panelPositions)[number] | undefined = 'Bottom';

	reset() {
		this.isStatusBar = false;
		this.isPanel = false;
		this.isActivityBar = false;
		this.selectedPosition = 'Bottom';
	}
}

export const dropdownWithStateCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import {
  HlmMenuDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';
import {
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemCheckboxDirective,
  BrnMenuItemDirective,
  BrnMenuItemRadioDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import { NgFor } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { radixReset } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-dropdown-with-state',
  standalone: true,
  imports: [
    BrnMenuDirective,
    BrnMenuItemDirective,
    BrnMenuTriggerDirective,
    BrnMenuGroupDirective,
    BrnMenuItemRadioDirective,
    BrnMenuItemCheckboxDirective,

    HlmMenuDirective,
    HlmSubMenuDirective,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,

    HlmButtonDirective,
    HlmIconComponent,

    NgFor,
    HlmMenuItemCheckComponent,
    HlmMenuItemRadioComponent,
  ],
  providers: [provideIcons({ radixReset })],
  template: \`
    <div class="w-full flex justify-center items-center pt-[20%]">
      <button hlmBtn variant="outline" align="center" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <div hlm brnMenu class="w-56">
        <div brnMenuGroup>
          <hlm-menu-label>Appearance</hlm-menu-label>

          <button hlm brnMenuItemCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
            <hlm-menu-item-check />
            <span>Panel</span>
          </button>

          <button
            hlm
            brnMenuItemCheckbox
            disabled
            [checked]="isActivityBar"
            (triggered)="isActivityBar = !isActivityBar"
          >
            <hlm-menu-item-check />
            <span>Activity Bar</span>
          </button>

          <button hlm brnMenuItemCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
            <hlm-menu-item-check />
            <span>Status Bar</span>
          </button>
        </div>

        <hlm-menu-separator />

        <hlm-menu-label>Panel Position</hlm-menu-label>

        <div brnMenuGroup>
          <button
            hlm
            brnMenuItemRadio
            *ngFor="let size of panelPositions"
            [checked]="size === selectedPosition"
            (triggered)="selectedPosition = size"
          >
            <hlm-menu-item-radio />
            <span>{{ size }}</span>
          </button>
        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem (triggered)="reset()">
          <hlm-icon name="radixReset" hlmMenuIcon />
          Reset
        </button>
      </div>
    </ng-template>
  \`,
})
export class DropdownWithStatePreviewComponent {
  isStatusBar = false;
  isPanel = false;
  isActivityBar = false;

  panelPositions = ['Top', 'Bottom', 'Right', 'Left'] as const;
  selectedPosition: (typeof this.panelPositions)[number] | undefined = 'Bottom';

  reset() {
    this.isStatusBar = false;
    this.isPanel = false;
    this.isActivityBar = false;
    this.selectedPosition = 'Bottom';
  }
}
`;
