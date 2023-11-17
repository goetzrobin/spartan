import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, Input, signal, TemplateRef } from '@angular/core';

export type BrnCtxMenuAlign = 'start' | 'center' | 'end' | undefined;

@Directive({
	selector: '[brnCtxMenuTriggerFor]',
	standalone: true,
	hostDirectives: [CdkContextMenuTrigger],
})
export class BrnContextMenuTriggerDirective {
	private readonly _cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
	private readonly _align = signal<BrnCtxMenuAlign>(undefined);
	@Input()
	set align(value: BrnCtxMenuAlign) {
		this._align.set(value);
	}

	@Input()
	set brnCtxMenuTriggerFor(value: TemplateRef<unknown> | null) {
		this._cdkTrigger.menuTemplateRef = value;
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
