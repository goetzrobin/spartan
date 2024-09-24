import { Component, HostListener, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCalendar,
	lucideCog,
	lucideLayers,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideX,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import {
	BrnDialogCloseDirective,
	BrnDialogComponent,
	BrnDialogContentDirective,
	BrnDialogOverlayComponent,
	BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import { HlmDialogOverlayDirective } from '@spartan-ng/ui-dialog-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmCodeDirective } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-command-dialog',
	standalone: true,
	providers: [
		provideIcons({
			lucideX,
			lucideCalendar,
			lucideSmile,
			lucidePlus,
			lucideUser,
			lucideLayers,
			lucideCog,
			lucideSearch,
		}),
	],
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		HlmIconComponent,
		HlmButtonDirective,

		BrnDialogComponent,
		BrnDialogCloseDirective,
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		BrnDialogOverlayComponent,
		HlmDialogOverlayDirective,
		HlmCodeDirective,
	],
	template: `
		<div class="mx-auto flex max-w-screen-sm items-center justify-center space-x-4 py-20 text-sm">
			<p>
				Press
				<code hlmCode>⌘ + K</code>
			</p>
			<p>
				Last command:
				<code data-testid="lastCommand" hlmCode>{{ command() || 'none' }}</code>
			</p>
		</div>
		<brn-dialog closeDelay="100" [state]="state()" (stateChanged)="stateChanged($event)">
			<brn-dialog-overlay hlm />
			<brn-cmd *brnDialogContent="let ctx" hlmCmdDialog class="mx-auto sm:w-[400px]">
				<hlm-cmd-input-wrapper>
					<hlm-icon name="lucideSearch" />
					<input placeholder="Type a command or search..." brnCmdInput hlm />
					<button brnDialogClose hlmCmdDialogCloseBtn>
						<hlm-icon name="lucideX" />
					</button>
				</hlm-cmd-input-wrapper>
				<div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
				<brn-cmd-list hlm>
					<brn-cmd-group hlm label="Suggestions">
						<button brnCmdItem value="calendar" (selected)="commandSelected('calendar')" hlm>
							<hlm-icon name="lucideCalendar" hlmCmdIcon />
							Calendar
						</button>
						<button brnCmdItem value="emojy" (selected)="commandSelected('emojy')" hlm>
							<hlm-icon name="lucideSmile" hlmCmdIcon />
							Search Emoji
						</button>
						<button brnCmdItem value="calculator" (selected)="commandSelected('calculator')" hlm>
							<hlm-icon name="lucidePlus" hlmCmdIcon />
							Calculator
						</button>
					</brn-cmd-group>
					<brn-cmd-separator hlm></brn-cmd-separator>
					<brn-cmd-group hlm label="Settings">
						<button brnCmdItem value="profile" (selected)="commandSelected('profile')" hlm>
							<hlm-icon name="lucideUser" hlmCmdIcon />
							Profile
							<hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
						</button>
						<button brnCmdItem value="billing" (selected)="commandSelected('billing')" hlm>
							<hlm-icon name="lucideLayers" hlmCmdIcon />
							Billing
							<hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
						</button>
						<button brnCmdItem value="settings" (selected)="commandSelected('settings')" hlm>
							<hlm-icon name="lucideCog" hlmCmdIcon />
							Settings
							<hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
						</button>
					</brn-cmd-group>
				</brn-cmd-list>
			</brn-cmd>
		</brn-dialog>
	`,
})
export class CommandDialogComponent {
	public command = signal('');
	public state = signal<'closed' | 'open'>('closed');
	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
			this.state.set('open');
		}
	}
	stateChanged(state: 'open' | 'closed') {
		this.state.set(state);
	}

	commandSelected(selected: string) {
		this.state.set('closed');
		this.command.set(selected);
	}
}
export const commandDialogCode = `
`;
