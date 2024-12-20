import { NgForOf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';

type Framework = { label: string; value: string };

@Component({
	selector: 'spartan-combobox-preview',
	standalone: true,
	imports: [
		BrnCommandImports,
		HlmCommandImports,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		HlmPopoverContentDirective,
		BrnPopoverContentDirective,
		NgForOf,
	],
	providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
	template: `
		<brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
			<button
				class="w-[200px] justify-between"
				id="edit-profile"
				variant="outline"
				brnPopoverTrigger
				(click)="state.set('open')"
				hlmBtn
			>
				{{ currentFramework() ? currentFramework()?.label : 'Select framework...' }}
				<ng-icon hlm size="sm" name="lucideChevronsUpDown" />
			</button>
			<brn-cmd *brnPopoverContent="let ctx" hlmPopoverContent hlm class="w-[200px] p-0">
				<hlm-cmd-input-wrapper>
					<ng-icon hlm name="lucideSearch" />
					<input placeholder="Search framework..." brnCmdInput hlm />
				</hlm-cmd-input-wrapper>
				<div *brnCmdEmpty hlmCmdEmpty>No results found.</div>
				<brn-cmd-list hlm>
					<brn-cmd-group hlm>
						@for (framework of frameworks; track framework) {
							<button brnCmdItem [value]="framework.value" (selected)="commandSelected(framework)" hlm>
								<ng-icon
									hlm
									[class.opacity-0]="currentFramework()?.value !== framework.value"
									name="lucideCheck"
									hlmCmdIcon
								/>
								{{ framework.label }}
							</button>
						}
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
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { NgForOf } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideCheck, lucideSearch } from '@ng-icons/lucide';

type Framework = { label: string; value: string };

@Component({
  selector: 'spartan-combobox-preview',
  standalone: true,
  imports: [
    BrnCommandImports,
    HlmCommandImports,
    HlmIconDirective,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: \`
    <brn-popover [state]="state()" (stateChanged)="stateChanged($event)" sideOffset="5" closeDelay="100">
      <button class="w-[200px] justify-between" id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn>
        {{ currentFramework() ? currentFramework().label : 'Select framework...' }}
        <ng-icon hlm size="sm" name="lucideChevronsUpDown" />
      </button>
      <brn-cmd *brnPopoverContent="let ctx" hlmPopoverContent hlm class="p-0 w-[200px]">
        <hlm-cmd-input-wrapper>
          <ng-icon hlm name="lucideSearch" />
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
              <ng-icon hlm
                [class.opacity-0]="currentFramework()?.value !== framework.value"
                name="lucideCheck"
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
