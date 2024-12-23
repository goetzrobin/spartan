import { NgForOf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucide from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmCommandImports } from '../command/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmPopoverContentDirective } from '../popover/helm/src';

const meta: Meta<{}> = {
	title: 'Combobox',
	decorators: [
		moduleMetadata({
			providers: [provideIcons(lucide)],
			imports: [BrnCommandImports, HlmCommandImports, NgIcon, HlmIconDirective, HlmButtonDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;
type Framework = { label: string; value: string };

@Component({
	selector: 'combobox-component',
	standalone: true,
	imports: [
		NgForOf,
		BrnCommandImports,
		HlmCommandImports,
		BrnPopoverImports,
		HlmPopoverContentDirective,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,
	],
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
				{{ currentFramework() ? currentFramework().label : 'Select framework...' }}
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
class ComboboxComponent {
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

export const Default: Story = {
	decorators: [
		moduleMetadata({
			imports: [ComboboxComponent],
		}),
	],
	render: () => ({
		template: '<combobox-component/>',
	}),
};
