import { Directive, inject } from '@angular/core';
import { BrnTooltipDirective } from '@spartan-ng/ui-tooltip-brain';

@Directive({
	selector: '[hlmTooltip]',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTooltipDirective,
			inputs: [
				'brnTooltip: hlmTooltip',
				'aria-describedby',
				'disabled',
				'position',
				'positionAtOrigin',
				'hideDelay',
				'showDelay',
				'exitAnimationDuration',
				'touchGestures',
			],
		},
	],
})
export class HlmTooltipDirective {
	private readonly _brnTooltip: BrnTooltipDirective = inject(BrnTooltipDirective, { host: true });

	constructor() {
		if (this._brnTooltip) {
			this._brnTooltip.exitAnimationDuration = 150;
			this._brnTooltip.hideDelay = 500;
			this._brnTooltip.showDelay = 700;
			this._brnTooltip.tooltipContentClasses =
				'overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95 ' +
				'data-[state=open]:animate-in ' +
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ' +
				'data-[side=below]:slide-in-from-top-2 data-[side=above]:slide-in-from-bottom-2 ' +
				'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 ' +
				'data-[side=after]:slide-in-from-left-2 data-[side=before]:slide-in-from-right-2 ';
		}
	}
}
