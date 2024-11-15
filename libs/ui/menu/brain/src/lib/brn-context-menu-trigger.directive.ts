import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { Directive, Input, type TemplateRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
	public set align(value: BrnCtxMenuAlign) {
		this._align.set(value);
	}

	@Input()
	public set brnCtxMenuTriggerFor(value: TemplateRef<unknown> | null) {
		this._cdkTrigger.menuTemplateRef = value;
	}

	@Input()
	public set brnCtxMenuTriggerData(value: unknown) {
		this._cdkTrigger.menuData = value;
	}

	constructor() {
		// once the trigger opens we wait until the next tick and then grab the last position
		// used to position the menu. we store this in our trigger which the brnMenu directive has
		// access to through DI
		this._cdkTrigger.opened.pipe(takeUntilDestroyed()).subscribe(() =>
			setTimeout(
				() =>
					// eslint-disable-next-line
					((this._cdkTrigger as any)._spartanLastPosition = // eslint-disable-next-line
						(this._cdkTrigger as any).overlayRef._positionStrategy._lastPosition),
			),
		);

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
