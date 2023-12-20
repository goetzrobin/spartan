import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { TooltipPosition } from './brain/src';
import { HlmTooltipDirective } from './helm/src';

const meta: Meta<{}> = {
	argTypes: {},
	title: 'Tooltip',
	decorators: [
		moduleMetadata({
			imports: [HlmButtonDirective, HlmTooltipDirective, HlmIconComponent],
			providers: [provideIcons({ radixPlus })],
		}),
	],
};

export default meta;
type Story = StoryObj<{ position: TooltipPosition }>;
export const Default: Story = {
	argTypes: {
		position: {
			control: { type: 'radio' },
			options: ['above', 'below', 'left', 'right'],
		},
	},
	render: (args) => ({
		props: { position: args.position },
		template: `
<div class='p-40'>
  <button [hlmTooltip]='tpl' [position]='position' aria-describedby='Hello world' hlmBtn variant='outline'>Test</button>
</div>

<ng-template #tpl>
    <span class='flex items-center'>
      Add to library <hlm-icon class='ml-2' size='sm' name='radixPlus'/>
    </span>
</ng-template>
`,
	}),
};

@Component({
	selector: 'disabled-tooltip-story',
	standalone: true,
	imports: [HlmButtonDirective, HlmTooltipDirective, HlmIconComponent],
	providers: [provideIcons({ radixPlus })],
	template: `
		<div class="p-40">
			<button
				(click)="disabled.set(!disabled())"
				[hlmTooltip]="tpl"
				[hlmTooltipDisabled]="disabled()"
				aria-describedby="Hello world"
				hlmBtn
				variant="outline"
			>
				Test
			</button>
			<p>{{ disabled() ? 'disabled' : 'enabled' }}</p>
		</div>
		<ng-template #tpl>
			<span class="flex items-center">
				Add to library
				<hlm-icon class="ml-2" size="sm" name="radixPlus" />
			</span>
		</ng-template>
	`,
})
class DisabledTooltip {
	protected readonly disabled = signal(false);
}

export const Disabled: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [DisabledTooltip],
		},
		template: `<disabled-tooltip-story/>`,
	}),
};
