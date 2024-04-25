import { Directive, Input, type TemplateRef, inject } from '@angular/core';
import { BrnTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-brain';

@Directive({
	selector: '[hlmTooltipTrigger]',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTooltipTriggerDirective,
			inputs: [
				'brnTooltipDisabled: hlmTooltipDisabled',
				'aria-describedby',
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
export class HlmTooltipTriggerDirective {
	private readonly _brnTooltipTrigger: BrnTooltipTriggerDirective = inject(BrnTooltipTriggerDirective, { host: true });

	constructor() {
		if (this._brnTooltipTrigger) {
			this._brnTooltipTrigger.exitAnimationDuration = 150;
			this._brnTooltipTrigger.hideDelay = 300;
			this._brnTooltipTrigger.showDelay = 150;
			this._brnTooltipTrigger.tooltipContentClasses =
				'overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95 ' +
				'data-[state=open]:animate-in ' +
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ' +
				'data-[side=below]:slide-in-from-top-2 data-[side=above]:slide-in-from-bottom-2 ' +
				'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 ';
		}
	}

	@Input()
	set hlmTooltipTrigger(value: string | TemplateRef<unknown> | null) {
		this._brnTooltipTrigger.content = value;
	}
}
