import { Component, HostListener, signal } from '@angular/core';
import * as lucide from '@ng-icons/lucide';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { BrnDialogImports } from '../dialog/brain/src';
import { HlmDialogOverlayDirective } from '../dialog/helm/src';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmCodeDirective } from '../typography/helm/src';
import { BrnCommandComponent, BrnCommandImports } from './brain/src';
import { HlmCommandImports } from './helm/src';

const meta: Meta<BrnCommandComponent> = {
	title: 'Command',
	component: BrnCommandComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [BrnCommandImports, HlmCommandImports, HlmIconComponent, HlmButtonDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnCommandComponent>;

export const Default: Story = {
	render: () => ({
		template: `
       <brn-cmd class='max-w-sm mx-auto mt-[10%]' hlm>
      <hlm-cmd-input-wrapper>
        <hlm-icon name='lucideSearch' />
        <input placeholder='Type a command or search...' brnCmdInput hlm />
      </hlm-cmd-input-wrapper>
      <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
      <brn-cmd-list hlm>
        <brn-cmd-group hlm label='Suggestions'>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideCalendar' hlmCmdIcon />
            Calendar
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideSmile' hlmCmdIcon />
            Search Emoji
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideCalculator' hlmCmdIcon />
            Calculator
          </button>
        </brn-cmd-group>
        <brn-cmd-separator hlm></brn-cmd-separator>
        <brn-cmd-group hlm label='Settings'>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideUser' hlmCmdIcon />
            Profile
            <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideCreditCard' hlmCmdIcon />
            Billing
            <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
          </button>
          <button brnCmdItem hlm>
            <hlm-icon name='lucideSettings' hlmCmdIcon />
            Settings
            <hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
          </button>
        </brn-cmd-group>
      </brn-cmd-list>
    </brn-cmd>
    `,
	}),
};

@Component({
	selector: 'command-dialog-component',
	standalone: true,
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		BrnDialogImports,
		HlmDialogOverlayDirective,

		HlmIconComponent,
		HlmButtonDirective,
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
						<!-- Using 1rem for size to mimick h-4 w-4 -->
						<hlm-icon name="lucideX" size="1rem" class="items-center justify-center" />
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
							<hlm-icon name="lucideCalculator" hlmCmdIcon />
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
							<hlm-icon name="lucideCreditCard" hlmCmdIcon />
							Billing
							<hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
						</button>
						<button brnCmdItem value="settings" (selected)="commandSelected('settings')" hlm>
							<hlm-icon name="lucideSettings" hlmCmdIcon />
							Settings
							<hlm-cmd-shortcut>⌘S</hlm-cmd-shortcut>
						</button>
					</brn-cmd-group>
				</brn-cmd-list>
			</brn-cmd>
		</brn-dialog>
	`,
})
class CommandDialogComponent {
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

export const Dialog: Story = {
	decorators: [
		moduleMetadata({
			imports: [CommandDialogComponent],
		}),
	],
	render: () => ({
		template: '<command-dialog-component/>',
	}),
};
