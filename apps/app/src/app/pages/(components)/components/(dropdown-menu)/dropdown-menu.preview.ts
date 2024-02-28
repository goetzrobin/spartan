import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCode,
	lucideCog,
	lucideGithub,
	lucideHelpCircle,
	lucideKeyboard,
	lucideLayers,
	lucideLogOut,
	lucideMail,
	lucideMessageSquare,
	lucidePlus,
	lucidePlusCircle,
	lucideSmile,
	lucideUser,
	lucideUserCircle,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-dropdown-preview',
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
		HlmMenuGroupComponent,

		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [
		provideIcons({
			lucideUser,
			lucideLayers,
			lucideCog,
			lucideKeyboard,
			lucideUserCircle,
			lucideSmile,
			lucidePlus,
			lucideGithub,
			lucideHelpCircle,
			lucideCode,
			lucideLogOut,
			lucideMail,
			lucideMessageSquare,
			lucidePlusCircle,
		}),
	],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
		</div>
		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-label>My Account</hlm-menu-label>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem>
						<hlm-icon name="lucideUser" hlmMenuIcon />
						<span>Profile</span>
						<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="lucideLayers" hlmMenuIcon />
						<span>Billing</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="lucideCog" hlmMenuIcon />
						<span>Settings</span>
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="lucideKeyboard" hlmMenuIcon />
						<span>Keyboard Shortcuts</span>
						<hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<hlm-icon name="lucideUserCircle" hlmMenuIcon />
						<span>Team</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem [brnMenuTriggerFor]="invite">
						<hlm-icon name="lucideSmile" hlmMenuIcon />
						<span>Invite Users</span>
						<hlm-menu-item-sub-indicator />
					</button>

					<button hlmMenuItem>
						<hlm-icon name="lucidePlus" hlmMenuIcon />
						<span>New Team</span>
						<hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<hlm-icon name="lucideGithub" hlmMenuIcon />
						<span>Github</span>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="lucideHelpCircle" hlmMenuIcon />
						<span>Support</span>
					</button>

					<button hlmMenuItem disabled>
						<hlm-icon name="lucideCode" hlmMenuIcon />
						<span>API</span>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem>
					<hlm-icon name="lucideLogOut" hlmMenuIcon />
					<span>Logout</span>
					<hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-sub-menu>
				<button hlmMenuItem>
					<hlm-icon name="lucideMail" hlmMenuIcon />
					Email
				</button>

				<button hlmMenuItem>
					<hlm-icon name="lucideMessageSquare" hlmMenuIcon />
					Message
				</button>
				<hlm-menu-separator />
				<button hlmMenuItem>
					<hlm-icon name="lucidePlusCircle" hlmMenuIcon />
					<span>More</span>
				</button>
			</hlm-sub-menu>
		</ng-template>
	`,
})
export class DropdownPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideUserCircle,
  lucideLayers,
  lucideMessageSquare,
  lucideCode,
  lucideMail,
  lucideLogOut,
  lucideSmile,
  lucideCog,
  lucideGithub,
  lucideKeyboard,
  lucideUser,
  lucidePlus,
  lucidePlusCircle,
  lucideHelpCircle,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dropdown-preview',
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
    HlmMenuGroupComponent,

    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideLayers,
      lucideCog,
      lucideKeyboard,
      lucideUserCircle,
      lucideSmile,
      lucidePlus,
      lucideGithub,
      lucideHelpCircle,
      lucideCode,
      lucideLogOut,
      lucideMail,
      lucideMessageSquare,
      lucidePlusCircle,
    }),
  ],
  template: \`
    <div class="flex w-full items-center justify-center pt-[20%]">
      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <hlm-menu class="w-56">
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name="lucideUser" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="lucideLayers" hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="lucideCog" hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="lucideKeyboard" hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name="lucideUserCircle" hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem [brnMenuTriggerFor]="invite">
            <hlm-icon name="lucideSmile" hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlmMenuItem>
            <hlm-icon name="lucidePlus" hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name="lucideGithub" hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="lucideHelpCircle" hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlmMenuItem disabled>
            <hlm-icon name="lucideCode" hlmMenuIcon />
            <span>API</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem>
          <hlm-icon name="lucideLogOut" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </hlm-menu>
    </ng-template>

    <ng-template #invite>
      <hlm-sub-menu>
        <button hlmMenuItem>
          <hlm-icon name="lucideMail" hlmMenuIcon />
          Email
        </button>

        <button hlmMenuItem>
          <hlm-icon name="lucideMessageSquare" hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>
          <hlm-icon name="lucidePlusCircle" hlmMenuIcon />
          <span>More</span>
        </button>
      </hlm-sub-menu>
    </ng-template>
  \`,
})
export class DropdownPreviewComponent {}
`;

export const defaultImports = `
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
`;

export const defaultSkeleton = `
<button [brnMenuTriggerFor]="menu">Open</button>

<ng-template #menu>
  <hlm-menu-group>
    <hlm-menu-label>My Account</hlm-menu-label>
    <hlm-menu-separator />
    <hlm-menu-group>
      <button hlmMenuItem>
        Profile
        <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
      </button>

      <hlm-menu-separator />

      <button hlmMenuItem [brnMenuTriggerFor]="invite">
        Invite Users
        <hlm-menu-item-sub-indicator />
      </button>
    </hlm-menu-group>
  </hlm-menu-group>
</ng-template>
`;
