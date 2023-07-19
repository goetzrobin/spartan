import { Component, HostListener, signal } from '@angular/core';
import { BrnCommandComponents } from '@spartan-ng/ui/command/brain';
import { HlmCommandPrimitives } from '@spartan-ng/ui/command/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import {
  BrnDialogCloseDirective,
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogOverlayComponent,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui/dialog/brain';
import { HlmDialogOverlayDirective } from '@spartan-ng/ui/dialog/helm';
import { HlmCodeDirective } from '@spartan-ng/ui/typography/helm';
import { provideIcons } from '@ng-icons/core';
import {
  radixCalendar,
  radixCardStack,
  radixCross1,
  radixFace,
  radixGear,
  radixPerson,
  radixPlus,
} from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-command-dialog',
  standalone: true,
  providers: [
    provideIcons({
      radixCross1,
      radixCalendar,
      radixFace,
      radixPlus,
      radixPerson,
      radixCardStack,
      radixGear,
    }),
  ],
  imports: [
    BrnCommandComponents,
    HlmCommandPrimitives,
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
    <div class="mx-auto max-w-screen-sm py-20 text-sm flex space-x-4 items-center justify-center">
      <p>Press <code hlmCode>⌘ + K</code></p>
      <p>
        Last command: <code data-testid="lastCommand" hlmCode>{{ command() || 'none' }}</code>
      </p>
    </div>
    <brn-dialog closeDelay="100" [state]="state()" (stateChanged)="stateChanged($event)">
      <brn-dialog-overlay hlm />
      <brn-cmd *brnDialogContent="let ctx" hlmCmdDialog class="sm:w-[400px] mx-auto">
        <hlm-cmd-input-wrapper>
          <hlm-icon name="radixMagnifyingGlass" />
          <input placeholder="Type a command or search..." brnCmdInput hlm />
          <button brnDialogClose hlmCmdDialogCloseBtn>
            <hlm-icon name="radixCross1" />
          </button>
        </hlm-cmd-input-wrapper>
        <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
        <brn-cmd-list hlm>
          <brn-cmd-group hlm label="Suggestions">
            <button brnCmdItem value="calendar" (selected)="commandSelected('calendar')" hlm>
              <hlm-icon name="radixCalendar" hlmCmdIcon />
              Calendar
            </button>
            <button brnCmdItem value="emojy" (selected)="commandSelected('emojy')" hlm>
              <hlm-icon name="radixFace" hlmCmdIcon />
              Search Emoji
            </button>
            <button brnCmdItem value="calculator" (selected)="commandSelected('calculator')" hlm>
              <hlm-icon name="radixPlus" hlmCmdIcon />
              Calculator
            </button>
          </brn-cmd-group>
          <brn-cmd-separator hlm></brn-cmd-separator>
          <brn-cmd-group hlm label="Settings">
            <button brnCmdItem value="profile" (selected)="commandSelected('profile')" hlm>
              <hlm-icon name="radixPerson" hlmCmdIcon />
              Profile
              <hlm-cmd-shortcut>⌘P</hlm-cmd-shortcut>
            </button>
            <button brnCmdItem value="billing" (selected)="commandSelected('billing')" hlm>
              <hlm-icon name="radixCardStack" hlmCmdIcon />
              Billing
              <hlm-cmd-shortcut>⌘B</hlm-cmd-shortcut>
            </button>
            <button brnCmdItem value="settings" (selected)="commandSelected('settings')" hlm>
              <hlm-icon name="radixGear" hlmCmdIcon />
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
