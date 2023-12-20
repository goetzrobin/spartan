import { Component } from '@angular/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
	selector: 'spartan-tooltip-preview',
	standalone: true,
	imports: [
		HlmTooltipComponent,
		HlmTooltipTriggerDirective,
		BrnTooltipContentDirective,
		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ radixPlus })],
	template: `
		<div>
			<hlm-tooltip>
				<button hlmTooltipTrigger aria-describedby="Hello world" hlmBtn variant="outline">Test</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library
					<hlm-icon class="ml-2" size="sm" name="radixPlus" />
				</span>
			</hlm-tooltip>
		</div>
	`,
})
export class TooltipPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'spartan-tooltip-preview',
  standalone: true,
  imports: [
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    BrnTooltipContentDirective,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixPlus })],
  template: \`
    <hlm-tooltip>
      <button hlmTooltipTrigger aria-describedby="Hello world" hlmBtn variant="outline">Test</button>
      <span *brnTooltipContent class="flex items-center">
        Add to library
        <hlm-icon class="ml-2" size="sm" name="radixPlus" />
      </span>
    </hlm-tooltip>
  \`,
})
export class TooltipPreviewComponent {}
`;

export const defaultImports = `
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';
`;
export const defaultSkeleton = `
<hlm-tooltip>
  <button hlmTooltipTrigger aria-describedby="Hello world">Test</button>
  <span *brnTooltipContent>Add to library</span>
</hlm-tooltip>
`;
