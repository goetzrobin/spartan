import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import * as radixIcons from '@ng-icons/radix-icons';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import {
	BrnMenuDirective,
	BrnMenuGroupDirective,
	BrnMenuImports,
	BrnMenuItemCheckboxDirective,
	BrnMenuItemDirective,
	BrnMenuItemRadioDirective,
	BrnMenuTriggerDirective,
} from './brain/src';
import {
	HlmMenuDirective,
	HlmMenuImports,
	HlmMenuItemCheckComponent,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemRadioComponent,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuDirective,
} from './helm/src';

const meta: Meta<{}> = {
	title: 'Dropdown Menu',
	decorators: [
		moduleMetadata({
			providers: [provideIcons(radixIcons)],
			imports: [BrnMenuImports, HlmMenuImports, HlmButtonDirective, HlmIconComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
	render: () => ({
		template: `

    <div class='w-full flex justify-center items-center pt-[20%]'>
      <button hlmBtn variant='outline' align='end' [brnMenuTriggerFor]='menu'>Open</button>
    </div>
    <ng-template #menu>
      <div hlm brnMenu class='w-56'>
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name='radixPerson' hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name='radixCardStack' hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name='radixGear' hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name='radixKeyboard' hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name='radixAvatar' hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem [brnMenuTriggerFor]='invite'>
            <hlm-icon name='radixFace' hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name='radixPlus' hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem [disabled]='false'>
            <hlm-icon name='radixGithubLogo' hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlm brnMenuItem [disabled]='true'>
            <hlm-icon name='radixQuestionMarkCircled' hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlm brnMenuItem disabled>
            <hlm-icon name='radixCode' hlmMenuIcon />
            <span>API</span>
          </button>
        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem>
          <hlm-icon name='radixExit' hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>

      </div>
    </ng-template>

    <ng-template #invite>
      <div hlm brnSubMenu>
        <button hlm brnMenuItem>
          <hlm-icon name='radixEnvelopeClosed' hlmMenuIcon />
          Email
        </button>

        <button hlm brnMenuItem>
          <hlm-icon name='radixChatBubble' hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>
          <hlm-icon name='radixPlusCircled' hlmMenuIcon />
          <span>More</span>
        </button>
      </div>
    </ng-template>
    `,
	}),
};

@Component({
	selector: 'stateful-dropdown-story',
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
class StatefulStory {
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

export const Stateful: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [StatefulStory],
		},
		template: `<stateful-dropdown-story/>`,
	}),
};
