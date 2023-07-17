import { Component, signal } from '@angular/core';
import { BrnCommandComponents } from '@ng-spartan/ui/command/brain';
import { HlmCommandPrimitives } from '@ng-spartan/ui/command/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@ng-spartan/ui/popover/brain';
import { HlmPopoverContentDirective } from '@ng-spartan/ui/popover/helm';
import { NgForOf } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { radixCaretSort, radixCheck, radixMagnifyingGlass } from '@ng-icons/radix-icons';

type Framework = { label: string; value: string };

@Component({
  selector: 'spartan-combobox-preview',
  standalone: true,
  imports: [
    BrnCommandComponents,
    HlmCommandPrimitives,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
  ],
  providers: [provideIcons({ radixCaretSort, radixMagnifyingGlass, radixCheck })],
  template: `
    <brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
      <button class="w-[200px] justify-between" id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn>
        {{ currentFramework() ? currentFramework().label : 'Select framework...' }}
        <hlm-icon size="sm" name="radixCaretSort" />
      </button>
      <brn-cmd *brnPopoverContent="let ctx" hlmPopoverContent hlm class="p-0 w-[200px]">
        <hlm-cmd-input-wrapper>
          <hlm-icon name="radixMagnifyingGlass" />
          <input placeholder="Search framework..." brnCmdInput hlm />
        </hlm-cmd-input-wrapper>
        <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
        <brn-cmd-list hlm>
          <brn-cmd-group hlm>
            <button
              *ngFor="let framework of frameworks"
              brnCmdItem
              [value]="framework.value"
              (selected)="commandSelected(framework)"
              hlm
            >
              <hlm-icon
                [class.opacity-0]="currentFramework()?.value !== framework.value"
                name="radixCheck"
                hlmCmdIcon
              />
              {{ framework.label }}
            </button>
          </brn-cmd-group>
        </brn-cmd-list>
      </brn-cmd>
    </brn-popover>
  `,
})
export class ComboboxPreviewComponent {
  public frameworks = [
    {
      label: 'AnalogJs',
      value: 'analogjs',
    },
    {
      label: 'Angular',
      value: 'angular',
    },
    {
      label: 'Vue',
      value: 'vue',
    },
    {
      label: 'Nuxt',
      value: 'nuxt',
    },
    {
      label: 'React',
      value: 'react',
    },
    {
      label: 'NextJs',
      value: 'nextjs',
    },
  ];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.currentFramework.set(framework);
    }
  }
}

export const defaultCode = `
import { Component, signal } from '@angular/core';
import { BrnCommandComponents } from '@ng-spartan/ui/command/brain';
import { HlmCommandPrimitives } from '@ng-spartan/ui/command/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@ng-spartan/ui/popover/brain';
import { HlmPopoverContentDirective } from '@ng-spartan/ui/popover/helm';
import { NgForOf } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { radixCaretSort, radixCheck, radixMagnifyingGlass } from '@ng-icons/radix-icons';

type Framework = { label: string; value: string };

@Component({
  selector: 'spartan-combobox-preview',
  standalone: true,
  imports: [
    BrnCommandComponents,
    HlmCommandPrimitives,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
  ],
  providers: [provideIcons({ radixCaretSort, radixMagnifyingGlass, radixCheck })],
  template: \`
    <brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
      <button class="w-[200px] justify-between" id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn>
        {{ currentFramework() ? currentFramework().label : 'Select framework...' }}
        <hlm-icon size="sm" name="radixCaretSort" />
      </button>
      <brn-cmd *brnPopoverContent="let ctx" hlmPopoverContent hlm class="p-0 w-[200px]">
        <hlm-cmd-input-wrapper>
          <hlm-icon name="radixMagnifyingGlass" />
          <input placeholder="Search framework..." brnCmdInput hlm />
        </hlm-cmd-input-wrapper>
        <div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
        <brn-cmd-list hlm>
          <brn-cmd-group hlm>
            <button
              *ngFor="let framework of frameworks"
              brnCmdItem
              [value]="framework.value"
              (selected)="commandSelected(framework)"
              hlm
            >
              <hlm-icon
                [class.opacity-0]="currentFramework()?.value !== framework.value"
                name="radixCheck"
                hlmCmdIcon
              />
              {{ framework.label }}
            </button>
          </brn-cmd-group>
        </brn-cmd-list>
      </brn-cmd>
    </brn-popover>
  \`,
})
export class ComboboxPreviewComponent {
  public frameworks = [
    {
      label: 'AnalogJs',
      value: 'analogjs',
    },
    {
      label: 'Angular',
      value: 'angular',
    },
    {
      label: 'Vue',
      value: 'vue',
    },
    {
      label: 'Nuxt',
      value: 'nuxt',
    },
    {
      label: 'React',
      value: 'react',
    },
    {
      label: 'NextJs',
      value: 'nextjs',
    },
  ];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.currentFramework.set(framework);
    }
  }
}
`;
