import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { BrnMenuTriggerDirective } from './brain/src';
import { HlmMenuComponent, HlmMenuImports, HlmMenuItemCheckComponent, HlmMenuItemRadioComponent } from './helm/src';

const meta: Meta<HlmMenuComponent> = {
	title: 'Dropdown Menu',
	component: HlmMenuComponent,
	tags: ['autodocs'],
	args: {
		variant: 'default',
	},
	argTypes: {
		variant: {
			options: ['default', 'menubar'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [BrnMenuTriggerDirective, HlmMenuImports, HlmButtonDirective, HlmIconComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmMenuComponent>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class='w-full flex justify-center items-center pt-[20%]'>
      <button hlmBtn variant='outline' align='end' [brnMenuTriggerFor]='menu'>Open</button>
    </div>
    <ng-template #menu>
      <hlm-menu ${argsToTemplate(args)} class='w-56'>
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name='lucideUser' hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name='lucideCreditCard' hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name='lucideSettings' hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name='lucideKeyboard' hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name='lucideUsers' hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem [brnMenuTriggerFor]='invite'>
            <hlm-icon name='lucideUserPlus' hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlmMenuItem>
            <hlm-icon name='lucidePlus' hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem [disabled]='false'>
            <hlm-icon name='lucideGithub' hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlmMenuItem [disabled]='true'>
            <hlm-icon name='lucideLifeBuoy' hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlmMenuItem disabled>
            <hlm-icon name='lucideCloud' hlmMenuIcon />
            <span>API</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem>
          <hlm-icon name='lucideLogOut' hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>

      </hlm-menu>
    </ng-template>

    <ng-template #invite>
      <hlm-sub-menu>
        <button hlmMenuItem>
          <hlm-icon name='lucideMail' hlmMenuIcon />
          Email
        </button>

        <button hlmMenuItem>
          <hlm-icon name='lucideMessageSquare' hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>
          <hlm-icon name='lucidePlusCircle' hlmMenuIcon />
          <span>More</span>
        </button>
      </hlm-sub-menu>
    </ng-template>
    `,
	}),
};

@Component({
	selector: 'stateful-dropdown-story',
	standalone: true,
	imports: [
		BrnMenuTriggerDirective,

		HlmMenuImports,

		HlmButtonDirective,
		HlmIconComponent,

		HlmMenuItemCheckComponent,
		HlmMenuItemRadioComponent,
	],
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
