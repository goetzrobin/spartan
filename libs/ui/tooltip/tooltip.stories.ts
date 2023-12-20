import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { BrnTooltipContentDirective, TooltipPosition } from './brain/src';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from './helm/src';

const meta: Meta<{}> = {
	argTypes: {},
	title: 'Tooltip',
	decorators: [
		moduleMetadata({
			imports: [
				HlmButtonDirective,
				HlmTooltipComponent,
				BrnTooltipContentDirective,
				HlmTooltipTriggerDirective,
				HlmIconComponent,
			],
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
			defaultValue: 'above',
		},
	},
	render: (args) => ({
		props: { position: args.position },
		template: `
<div class='p-40'>
  <hlm-tooltip>
    <button hlmTooltipTrigger [position]='position' aria-describedby='Hello world' hlmBtn variant='outline'>Test</button>
    <span *brnTooltipContent class='flex items-center'>
      Add to library <hlm-icon class='ml-2' size='sm' name='radixPlus'/>
     </span>
  </hlm-tooltip>
</div>
`,
	}),
};

@Component({
	selector: 'disabled-tooltip-story',
	standalone: true,
	imports: [
		HlmButtonDirective,
		HlmTooltipComponent,
		BrnTooltipContentDirective,
		HlmTooltipTriggerDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ radixPlus })],
	template: `
		<div class="p-40">
			<hlm-tooltip>
				<button
					(click)="disabled.set(!disabled())"
					hlmTooltipTrigger
					[hlmTooltipDisabled]="disabled()"
					aria-describedby="Hello world"
					hlmBtn
					variant="outline"
				>
					Test
				</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library
					<hlm-icon class="ml-2" size="sm" name="radixPlus" />
				</span>
			</hlm-tooltip>
			<p>{{ disabled() ? 'disabled' : 'enabled' }}</p>
		</div>
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
