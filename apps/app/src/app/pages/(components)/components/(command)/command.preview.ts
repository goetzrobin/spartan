import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCalendar,
	lucideCog,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideWallet,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-command-preview',
	standalone: true,
	imports: [BrnCommandImports, HlmCommandImports, HlmIconComponent, HlmButtonDirective],
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
				<hlm-icon name="lucideSearch" />
				<input placeholder="Type a command or search..." brnCmdInput hlm />
			</hlm-cmd-input-wrapper>
			<div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
			<brn-cmd-list hlm>
				<brn-cmd-group hlm label="Suggestions">
					<button brnCmdItem hlm>
						<hlm-icon name="lucideCalendar" hlmCmdIcon />
						Calendar
					</button>
					<button brnCmdItem hlm>
						<hlm-icon name="lucideSmile" hlmCmdIcon />
						Search Emoji
					</button>
					<button brnCmdItem hlm>
						<hlm-icon name="lucidePlus" hlmCmdIcon />
						Calculator
					</button>
				</brn-cmd-group>
				<brn-cmd-separator hlm></brn-cmd-separator>
				<brn-cmd-group hlm label="Settings">
					<button brnCmdItem hlm>
						<hlm-icon name="lucideUser" hlmCmdIcon />
						Profile
						<hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
					</button>
					<button brnCmdItem hlm>
						<hlm-icon name="lucideWallet" hlmCmdIcon />
						Billing
						<hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
					</button>
					<button brnCmdItem hlm>
						<hlm-icon name="lucideCog" hlmCmdIcon />
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
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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
  imports: [BrnCommandImports, HlmCommandImports, HlmIconComponent, HlmButtonDirective],
  providers: [
    provideIcons({ lucideSearch, lucideCalendar, lucideSmile, lucidePlus, lucideUser, lucideWallet, lucideCog }),
  ],
  template: \`
    <brn-cmd class="w-96" hlm>
      <hlm-cmd-input-wrapper>
        <hlm-icon name="lucideSearch" />
        <input placeholder="Type a command or search..." brnCmdInput hlm />
      </hlm-cmd-input-wrapper>
      <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
      <brn-cmd-list hlm>
        <brn-cmd-group hlm label="Suggestions">
          <button brnCmdItem hlm>
            <hlm-icon name="lucideCalendar" hlmCmdIcon />
            Calendar
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="lucideSmile" hlmCmdIcon />
            Search Emoji
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="lucidePlus" hlmCmdIcon />
            Calculator
          </button>
        </brn-cmd-group>
        <brn-cmd-separator hlm></brn-cmd-separator>
        <brn-cmd-group hlm label="Settings">
          <button brnCmdItem hlm>
            <hlm-icon name="lucideUser" hlmCmdIcon />
            Profile
            <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="lucideWallet" hlmCmdIcon />
            Billing
            <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name="lucideCog" hlmCmdIcon />
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
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
`;

export const defaultSkeleton = `
<brn-cmd class="w-96" hlm>
  <hlm-cmd-input-wrapper>
    <hlm-icon name="lucideSearch" />
    <input placeholder="Type a command or search..." brnCmdInput hlm />
  </hlm-cmd-input-wrapper>
  <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
  <brn-cmd-list hlm>
    <brn-cmd-group hlm label="Suggestions">
      <button brnCmdItem hlm>
        <hlm-icon name="lucideCalendar" hlmCmdIcon />
        Calendar
      </button>
    </brn-cmd-group>
    <brn-cmd-separator hlm></brn-cmd-separator>
    <brn-cmd-group hlm label="Settings">
      <button brnCmdItem hlm>
        <hlm-icon name="lucideCog" hlmCmdIcon />
        Settings
        <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
      </button>
    </brn-cmd-group>
  </brn-cmd-list>
</brn-cmd>
`;
