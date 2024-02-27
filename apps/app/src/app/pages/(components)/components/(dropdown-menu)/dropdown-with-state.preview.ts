import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUndo2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemCheckboxDirective,
	HlmMenuItemCheckComponent,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemRadioComponent,
	HlmMenuItemRadioDirective,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-dropdown-with-state',
	standalone: true,
	imports: [
		BrnMenuTriggerDirective,

		HlmMenuComponent,
		HlmSubMenuComponent,
		HlmMenuItemDirective,
		HlmMenuItemSubIndicatorComponent,
		HlmMenuLabelComponent,
		HlmMenuShortcutComponent,
		HlmMenuSeparatorComponent,
		HlmMenuItemIconDirective,
		HlmMenuItemCheckComponent,
		HlmMenuItemRadioComponent,
		HlmMenuGroupComponent,
		HlmMenuItemRadioDirective,
		HlmMenuItemCheckboxDirective,

		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ lucideUndo2 })],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button hlmBtn variant="outline" align="center" [brnMenuTriggerFor]="menu">Open</button>
		</div>
		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-group>
					<hlm-menu-label>Appearance</hlm-menu-label>

					<button hlmMenuItemCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
						<hlm-menu-item-check />
						<span>Panel</span>
					</button>

					<button hlmMenuItemCheckbox disabled [checked]="isActivityBar" (triggered)="isActivityBar = !isActivityBar">
						<hlm-menu-item-check />
						<span>Activity Bar</span>
					</button>

					<button hlmMenuItemCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
						<hlm-menu-item-check />
						<span>Status Bar</span>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-label>Panel Position</hlm-menu-label>

				<hlm-menu-group>
					@for (size of panelPositions; track size) {
						<button hlmMenuItemRadio [checked]="size === selectedPosition" (triggered)="selectedPosition = size">
							<hlm-menu-item-radio />
							<span>{{ size }}</span>
						</button>
					}
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem (triggered)="reset()">
					<hlm-icon name="lucideUndo2" hlmMenuIcon />
					Reset
				</button>
			</hlm-menu>
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
import { provideIcons } from '@ng-icons/core';
import { lucideUndo2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemCheckboxDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemRadioDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dropdown-with-state',
  standalone: true,
  imports: [
    BrnMenuTriggerDirective,

    HlmMenuComponent,
    HlmSubMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuItemCheckComponent,
    HlmMenuItemRadioComponent,
    HlmMenuGroupComponent,
    HlmMenuItemRadioDirective,
    HlmMenuItemCheckboxDirective,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ lucideUndo2 })],
  template: \`
    <div class="flex w-full items-center justify-center pt-[20%]">
      <button hlmBtn variant="outline" align="center" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <hlm-menu class="w-56">
        <hlm-menu-group>
          <hlm-menu-label>Appearance</hlm-menu-label>

          <button hlmMenuItemCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
            <hlm-menu-item-check />
            <span>Panel</span>
          </button>

          <button hlmMenuItemCheckbox disabled [checked]="isActivityBar" (triggered)="isActivityBar = !isActivityBar">
            <hlm-menu-item-check />
            <span>Activity Bar</span>
          </button>

          <button hlmMenuItemCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
            <hlm-menu-item-check />
            <span>Status Bar</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-label>Panel Position</hlm-menu-label>

        <hlm-menu-group>
          @for (size of panelPositions; track size) {
            <button hlmMenuItemRadio [checked]="size === selectedPosition" (triggered)="selectedPosition = size">
              <hlm-menu-item-radio />
              <span>{{ size }}</span>
            </button>
          }
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem (triggered)="reset()">
          <hlm-icon name="lucideUndo2" hlmMenuIcon />
          Reset
        </button>
      </hlm-menu>
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
