import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
import {
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dropdown-preview',
  standalone: true,
  imports: [
    BrnMenuDirective,
    BrnMenuItemDirective,
    BrnMenuTriggerDirective,
    BrnMenuGroupDirective,

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
    <div class="w-full flex justify-center items-center pt-[20%]">
      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <div hlm brnMenu class="w-56">
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixPerson" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixCardStack" hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixGear" hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixKeyboard" hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixAvatar" hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem [brnMenuTriggerFor]="invite">
            <hlm-icon name="radixFace" hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixPlus" hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixGithubLogo" hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixQuestionMarkCircled" hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlm brnMenuItem disabled>
            <hlm-icon name="radixCode" hlmMenuIcon />
            <span>API</span>
          </button>
        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem>
          <hlm-icon name="radixExit" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </div>
    </ng-template>

    <ng-template #invite>
      <div hlm brnSubMenu>
        <button hlm brnMenuItem>
          <hlm-icon name="radixEnvelopeClosed" hlmMenuIcon />
          Email
        </button>

        <button hlm brnMenuItem>
          <hlm-icon name="radixChatBubble" hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>
          <hlm-icon name="radixPlusCircled" hlmMenuIcon />
          <span>More</span>
        </button>
      </div>
    </ng-template>
  `,
})
export class DropdownPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
import {
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';

@Component({
  selector: 'spartan-dropdown-preview',
  standalone: true,
  imports: [
    BrnMenuDirective,
    BrnMenuItemDirective,
    BrnMenuTriggerDirective,
    BrnMenuGroupDirective,

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
    <div class="w-full flex justify-center items-center pt-[20%]">
      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>
    </div>
    <ng-template #menu>
      <div hlm brnMenu class="w-56">
        <hlm-menu-label>My Account</hlm-menu-label>
        <hlm-menu-separator />
        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixPerson" hlmMenuIcon />
            <span>Profile</span>
            <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixCardStack" hlmMenuIcon />
            <span>Billing</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixGear" hlmMenuIcon />
            <span>Settings</span>
            <hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixKeyboard" hlmMenuIcon />
            <span>Keyboard Shortcuts</span>
            <hlm-menu-shortcut>⌘K</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixAvatar" hlmMenuIcon />
            <span>Team</span>
            <hlm-menu-shortcut>⌘B</hlm-menu-shortcut>
          </button>

          <button hlm brnMenuItem [brnMenuTriggerFor]="invite">
            <hlm-icon name="radixFace" hlmMenuIcon />
            <span>Invite Users</span>
            <hlm-menu-item-sub-indicator />
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixPlus" hlmMenuIcon />
            <span>New Team</span>
            <hlm-menu-shortcut>⌘+T</hlm-menu-shortcut>
          </button>
        </div>

        <hlm-menu-separator />

        <div brnMenuGroup>
          <button hlm brnMenuItem>
            <hlm-icon name="radixGithubLogo" hlmMenuIcon />
            <span>Github</span>
          </button>

          <button hlm brnMenuItem>
            <hlm-icon name="radixQuestionMarkCircled" hlmMenuIcon />
            <span>Support</span>
          </button>

          <button hlm brnMenuItem disabled>
            <hlm-icon name="radixCode" hlmMenuIcon />
            <span>API</span>
          </button>
        </div>

        <hlm-menu-separator />

        <button hlm brnMenuItem>
          <hlm-icon name="radixExit" hlmMenuIcon />
          <span>Logout</span>
          <hlm-menu-shortcut>⇧⌘Q</hlm-menu-shortcut>
        </button>
      </div>
    </ng-template>

    <ng-template #invite>
      <div hlm brnSubMenu>
        <button hlm brnMenuItem>
          <hlm-icon name="radixEnvelopeClosed" hlmMenuIcon />
          Email
        </button>

        <button hlm brnMenuItem>
          <hlm-icon name="radixChatBubble" hlmMenuIcon />
          Message
        </button>
        <hlm-menu-separator />
        <button hlm brnMenuItem>
          <hlm-icon name="radixPlusCircled" hlmMenuIcon />
          <span>More</span>
        </button>
      </div>
    </ng-template>
  \`,
})
export class DropdownPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnMenuDirective,
  BrnMenuGroupDirective,
  BrnMenuItemDirective,
  BrnMenuTriggerDirective,
} from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuDirective,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuDirective,
} from '@spartan-ng/ui-menu-helm';
`;

export const defaultSkeleton = `
<button [brnMenuTriggerFor]="menu">Open</button>

<ng-template #menu>
  <div hlm brnMenu>
    <hlm-menu-label>My Account</hlm-menu-label>
    <hlm-menu-separator />
    <div brnMenuGroup>
      <button hlm brnMenuItem>
        Profile
        <hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
      </button>

      <hlm-menu-separator />

      <button hlm brnMenuItem [brnMenuTriggerFor]="invite">
        Invite Users
        <hlm-menu-item-sub-indicator />
      </button>
    </div>
  </div>
</ng-template>
`;
