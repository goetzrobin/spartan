import { Directive, Input, type TemplateRef, inject } from '@angular/core';
import { BrnTooltipTriggerDirective } from '@spartan-ng/brain/tooltip';

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
			this._brnTooltipTrigger.exitAnimationDurationState().set(150);
			this._brnTooltipTrigger.hideDelayState().set(300);
			this._brnTooltipTrigger.showDelayState().set(150);
			this._brnTooltipTrigger
				.tooltipContentClassesState()
				.set(
					'overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95 ' +
						'data-[state=open]:animate-in ' +
						'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ' +
						'data-[side=below]:slide-in-from-top-2 data-[side=above]:slide-in-from-bottom-2 ' +
						'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 ',
				);
		}
	}

	@Input()
	public set hlmTooltipTrigger(value: string | TemplateRef<unknown> | null) {
		this._brnTooltipTrigger.contentState().set(value);
	}
}
