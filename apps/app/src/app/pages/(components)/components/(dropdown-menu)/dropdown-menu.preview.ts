import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	radixAvatar,
	radixCardStack,
	radixChatBubble,
	radixCode,
	radixEnvelopeClosed,
	radixExit,
	radixFace,
	radixGear,
	radixGithubLogo,
	radixKeyboard,
	radixPerson,
	radixPlus,
	radixPlusCircled,
	radixQuestionMarkCircled,
} from '@ng-icons/radix-icons';
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
			radixPerson,
			radixCardStack,
			radixGear,
			radixKeyboard,
			radixAvatar,
			radixFace,
			radixPlus,
			radixGithubLogo,
			radixQuestionMarkCircled,
			radixCode,
			radixExit,
			radixEnvelopeClosed,
			radixChatBubble,
			radixPlusCircled,
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
						<hlm-icon name="radixPerson" hlmMenuIcon />
						<span>Profile</span>
						<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="radixCardStack" hlmMenuIcon />
						<span>Billing</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="radixGear" hlmMenuIcon />
						<span>Settings</span>
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="radixKeyboard" hlmMenuIcon />
						<span>Keyboard Shortcuts</span>
						<hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<hlm-icon name="radixAvatar" hlmMenuIcon />
						<span>Team</span>
						<hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
					</button>

					<button hlmMenuItem [brnMenuTriggerFor]="invite">
						<hlm-icon name="radixFace" hlmMenuIcon />
						<span>Invite Users</span>
						<hlm-menu-item-sub-indicator />
					</button>

					<button hlmMenuItem>
						<hlm-icon name="radixPlus" hlmMenuIcon />
						<span>New Team</span>
						<hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<hlm-menu-group>
					<button hlmMenuItem>
						<hlm-icon name="radixGithubLogo" hlmMenuIcon />
						<span>Github</span>
					</button>

					<button hlmMenuItem>
						<hlm-icon name="radixQuestionMarkCircled" hlmMenuIcon />
						<span>Support</span>
					</button>

					<button hlmMenuItem disabled>
						<hlm-icon name="radixCode" hlmMenuIcon />
						<span>API</span>
					</button>
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem>
					<hlm-icon name="radixExit" hlmMenuIcon />
					<span>Logout</span>
					<hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>

		<ng-template #invite>
			<hlm-sub-menu>
				<button hlmMenuItem>
					<hlm-icon name="radixEnvelopeClosed" hlmMenuIcon />
					Email
				</button>

				<button hlmMenuItem>
					<hlm-icon name="radixChatBubble" hlmMenuIcon />
					Message
				</button>
				<hlm-menu-separator />
				<button hlmMenuItem>
					<hlm-icon name="radixPlusCircled" hlmMenuIcon />
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
  radixAvatar,
  radixCardStack,
  radixChatBubble,
  radixCode,
  radixEnvelopeClosed,
  radixExit,
  radixFace,
  radixGear,
  radixGithubLogo,
  radixKeyboard,
  radixPerson,
  radixPlus,
  radixPlusCircled,
  radixQuestionMarkCircled,
} from '@ng-icons/radix-icons';
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
      radixPerson,
      radixCardStack,
      radixGear,
      radixKeyboard,
      radixAvatar,
      radixFace,
      radixPlus,
      radixGithubLogo,
      radixQuestionMarkCircled,
      radixCode,
      radixExit,
      radixEnvelopeClosed,
      radixChatBubble,
      radixPlusCircled,
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
            <hlm-icon name="radixPerson" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="radixCardStack" hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="radixGear" hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="radixKeyboard" hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name="radixAvatar" hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlmMenuItem [brnMenuTriggerFor]="invite">
            <hlm-icon name="radixFace" hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlmMenuItem>
            <hlm-icon name="radixPlus" hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <hlm-menu-group>
          <button hlmMenuItem>
            <hlm-icon name="radixGithubLogo" hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlmMenuItem>
            <hlm-icon name="radixQuestionMarkCircled" hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlmMenuItem disabled>
            <hlm-icon name="radixCode" hlmMenuIcon />
            <span>API</span>
          </button>
        </hlm-menu-group>

        <hlm-menu-separator />

        <button hlmMenuItem>
          <hlm-icon name="radixExit" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </hlm-menu>
    </ng-template>

    <ng-template #invite>
      <hlm-sub-menu>
        <button hlmMenuItem>
          <hlm-icon name="radixEnvelopeClosed" hlmMenuIcon />
          Email
        </button>

        <button hlmMenuItem>
          <hlm-icon name="radixChatBubble" hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlmMenuItem>
          <hlm-icon name="radixPlusCircled" hlmMenuIcon />
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
