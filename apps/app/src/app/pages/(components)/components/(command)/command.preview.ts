import { Component } from '@angular/core';
import { BrnCommandComponents } from '@spartan-ng/ui-command-brain';
import { HlmCommandPrimitives } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { provideIcons } from '@ng-icons/core';
import {
  radixCalendar,
  radixCardStack,
  radixFace,
  radixGear,
  radixMagnifyingGlass,
  radixPerson,
  radixPlus,
} from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-command-preview',
  standalone: true,
  imports: [BrnCommandComponents, HlmCommandPrimitives, HlmIconComponent, HlmButtonDirective],
  providers: [
    provideIcons({ radixMagnifyingGlass, radixCalendar, radixFace, radixPlus, radixPerson, radixCardStack, radixGear }),
  ],
  template: `
    <brn-cmd class="w-96" hlm>
      <hlm-cmd-input-wrapper>
        <hlm-icon name="radixMagnifyingGlass" />
        <input placeholder="Type a command or search..." brnCmdInput hlm />
      </hlm-cmd-input-wrapper>
      <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
      <brn-cmd-list hlm>
        <brn-cmd-group hlm label="Suggestions">
          <button brnCmdItem hlm>
            <hlm-icon name="radixCalendar" hlmCmdIcon />
            Calendar
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixFace" hlmCmdIcon />
            Search Emoji
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixPlus" hlmCmdIcon />
            Calculator
          </button>
        </brn-cmd-group>
        <brn-cmd-separator hlm></brn-cmd-separator>
        <brn-cmd-group hlm label="Settings">
          <button brnCmdItem hlm>
            <hlm-icon name="radixPerson" hlmCmdIcon />
            Profile
            <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixCardStack" hlmCmdIcon />
            Billing
            <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixGear" hlmCmdIcon />
            Settings
            <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
          </button>
        </brn-cmd-group>
      </brn-cmd-list>
    </brn-cmd>
  `,
})
export class CommandPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { BrnCommandComponents } from '@spartan-ng/ui-command-brain';
import { HlmCommandPrimitives } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { provideIcons } from '@ng-icons/core';
import {
  radixCalendar,
  radixCardStack,
  radixFace,
  radixGear,
  radixMagnifyingGlass,
  radixPerson,
  radixPlus,
} from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-command-preview',
  standalone: true,
  imports: [BrnCommandComponents, HlmCommandPrimitives, HlmIconComponent, HlmButtonDirective],
  providers: [
    provideIcons({ radixMagnifyingGlass, radixCalendar, radixFace, radixPlus, radixPerson, radixCardStack, radixGear }),
  ],
  template: \`
    <brn-cmd class="w-96" hlm>
      <hlm-cmd-input-wrapper>
        <hlm-icon name="radixMagnifyingGlass" />
        <input placeholder="Type a command or search..." brnCmdInput hlm />
      </hlm-cmd-input-wrapper>
      <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
      <brn-cmd-list hlm>
        <brn-cmd-group hlm label="Suggestions">
          <button brnCmdItem hlm>
            <hlm-icon name="radixCalendar" hlmCmdIcon />
            Calendar
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixFace" hlmCmdIcon />
            Search Emoji
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixPlus" hlmCmdIcon />
            Calculator
          </button>
        </brn-cmd-group>
        <brn-cmd-separator hlm></brn-cmd-separator>
        <brn-cmd-group hlm label="Settings">
          <button brnCmdItem hlm>
            <hlm-icon name="radixPerson" hlmCmdIcon />
            Profile
            <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixCardStack" hlmCmdIcon />
            Billing
            <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="radixGear" hlmCmdIcon />
            Settings
            <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
          </button>
        </brn-cmd-group>
      </brn-cmd-list>
    </brn-cmd>
  \`,
})
export class CommandPreviewComponent {}
`;

export const defaultImports = `
import { BrnCommandComponents } from '@spartan-ng/ui-command-brain';
import { HlmCommandPrimitives } from '@spartan-ng/ui-command-helm';
`;

export const defaultSkeleton = `
<brn-cmd class="w-96" hlm>
  <hlm-cmd-input-wrapper>
    <hlm-icon name="radixMagnifyingGlass" />
    <input placeholder="Type a command or search..." brnCmdInput hlm />
  </hlm-cmd-input-wrapper>
  <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
  <brn-cmd-list hlm>
    <brn-cmd-group hlm label="Suggestions">
      <button brnCmdItem hlm>
        <hlm-icon name="radixCalendar" hlmCmdIcon />
        Calendar
      </button>
    </brn-cmd-group>
    <brn-cmd-separator hlm></brn-cmd-separator>
    <brn-cmd-group hlm label="Settings">
      <button brnCmdItem hlm>
        <hlm-icon name="radixGear" hlmCmdIcon />
        Settings
        <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
      </button>
    </brn-cmd-group>
  </brn-cmd-list>
</brn-cmd>
`;
