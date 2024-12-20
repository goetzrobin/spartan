import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCalendar,
	lucideCog,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideWallet,
} from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-command-preview',
	standalone: true,
	imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIconDirective, HlmButtonDirective],
	providers: [
		provideIcons({
			lucideSearch,
			lucideCalendar,
			lucideSmile,
			lucidePlus,
			lucideUser,
			lucideWallet,
			lucideCog,
		}),
	],
	template: `
		<brn-cmd class="w-96" hlm>
			<hlm-cmd-input-wrapper>
				<ng-icon hlm name="lucideSearch" />
				<input placeholder="Type a command or search..." brnCmdInput hlm />
			</hlm-cmd-input-wrapper>
			<div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
			<brn-cmd-list hlm>
				<brn-cmd-group hlm label="Suggestions">
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucideCalendar" hlmCmdIcon />
						Calendar
					</button>
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucideSmile" hlmCmdIcon />
						Search Emoji
					</button>
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucidePlus" hlmCmdIcon />
						Calculator
					</button>
				</brn-cmd-group>
				<brn-cmd-separator hlm></brn-cmd-separator>
				<brn-cmd-group hlm label="Settings">
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucideUser" hlmCmdIcon />
						Profile
						<hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
					</button>
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucideWallet" hlmCmdIcon />
						Billing
						<hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
					</button>
					<button brnCmdItem hlm>
						<ng-icon hlm name="lucideCog" hlmCmdIcon />
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideWallet,
  lucideSmile,
  lucideCog,
  lucideSearch,
  lucideUser,
  lucidePlus,
} from '@ng-icons/lucide';

@Component({
  selector: 'spartan-command-preview',
  standalone: true,
  imports: [BrnCommandImports, HlmCommandImports, HlmIconDirective, HlmButtonDirective],
  providers: [
    provideIcons({ lucideSearch, lucideCalendar, lucideSmile, lucidePlus, lucideUser, lucideWallet, lucideCog }),
  ],
  template: \`
    <brn-cmd class="w-96" hlm>
      <hlm-cmd-input-wrapper>
        <ng-icon hlm name="lucideSearch" />
        <input placeholder="Type a command or search..." brnCmdInput hlm />
      </hlm-cmd-input-wrapper>
      <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
      <brn-cmd-list hlm>
        <brn-cmd-group hlm label="Suggestions">
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucideCalendar" hlmCmdIcon />
            Calendar
          </button>
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucideSmile" hlmCmdIcon />
            Search Emoji
          </button>
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucidePlus" hlmCmdIcon />
            Calculator
          </button>
        </brn-cmd-group>
        <brn-cmd-separator hlm></brn-cmd-separator>
        <brn-cmd-group hlm label="Settings">
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucideUser" hlmCmdIcon />
            Profile
            <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucideWallet" hlmCmdIcon />
            Billing
            <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <ng-icon hlm name="lucideCog" hlmCmdIcon />
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
`;

export const defaultSkeleton = `
<brn-cmd class="w-96" hlm>
  <hlm-cmd-input-wrapper>
    <ng-icon hlm name="lucideSearch" />
    <input placeholder="Type a command or search..." brnCmdInput hlm />
  </hlm-cmd-input-wrapper>
  <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
  <brn-cmd-list hlm>
    <brn-cmd-group hlm label="Suggestions">
      <button brnCmdItem hlm>
        <ng-icon hlm name="lucideCalendar" hlmCmdIcon />
        Calendar
      </button>
    </brn-cmd-group>
    <brn-cmd-separator hlm></brn-cmd-separator>
    <brn-cmd-group hlm label="Settings">
      <button brnCmdItem hlm>
        <ng-icon hlm name="lucideCog" hlmCmdIcon />
        Settings
        <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
      </button>
    </brn-cmd-group>
  </brn-cmd-list>
</brn-cmd>
`;
