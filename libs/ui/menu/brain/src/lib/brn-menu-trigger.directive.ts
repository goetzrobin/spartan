import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, Input, signal } from '@angular/core';

export type BrnMenuAlign = 'start' | 'center' | 'end' | undefined;

@Directive({
	selector: '[brnMenuTriggerFor]',
	standalone: true,
	hostDirectives: [{ directive: CdkMenuTrigger, inputs: ['cdkMenuTriggerFor: brnMenuTriggerFor'] }],
})
export class BrnMenuTriggerDirective {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _align = signal<BrnMenuAlign>(undefined);
	@Input()
	set align(value: BrnMenuAlign) {
		this._align.set(value);
	}

	constructor() {
		effect(() => {
			const align = this._align();
			if (!align) return;
			this._cdkTrigger.menuPosition = [
				{
					originX: align,
					originY: 'bottom',
					overlayX: align,
					overlayY: 'top',
				},
				{
					originX: align,
					originY: 'top',
					overlayX: align,
					overlayY: 'bottom',
				},
			];
		});
	}
}
