import { Component } from '@angular/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmTooltipDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
	selector: 'spartan-tooltip-preview',
	standalone: true,
	imports: [HlmButtonDirective, HlmTooltipDirective, HlmIconComponent],
	providers: [provideIcons({ radixPlus })],
	template: `
		<div class="p-40">
			<button [hlmTooltip]="tpl" aria-describedby="Hello world" hlmBtn variant="outline">Hover</button>
		</div>

		<ng-template #tpl>
			<span class="flex items-center">
				Add to library
				<hlm-icon class="ml-2" size="sm" name="radixPlus" />
			</span>
		</ng-template>
	`,
})
export class TooltipPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { radixPlus } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmTooltipDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'spartan-tooltip-preview',
  standalone: true,
  imports: [HlmButtonDirective, HlmTooltipDirective, HlmIconComponent],
  providers: [provideIcons({ radixPlus })],
  template: \`
    <div class="p-40">
      <button [hlmTooltip]="tpl" aria-describedby="Hello world" hlmBtn variant="outline">Hover</button>
    </div>

    <ng-template #tpl>
      <span class="flex items-center">
        Add to library
        <hlm-icon class="ml-2" size="sm" name="radixPlus" />
      </span>
    </ng-template>
  \`,
})
export class TooltipPreviewComponent {}
`;

export const defaultImports = `
import { HlmTooltipDirective } from '@spartan-ng/ui-tooltip-helm';
`;
export const defaultSkeleton = `
<button [hlmTooltip]="tpl" aria-describedby="Hello world">Hover</button>
<ng-template #tpl>Add to library</ng-template>
`;
