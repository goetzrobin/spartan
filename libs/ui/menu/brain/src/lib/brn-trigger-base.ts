import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type BrnMenuAlign = 'start' | 'center' | 'end' | undefined;

@Directive()
export class BrnTriggerBase {
	protected readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	align = input<BrnMenuAlign>(undefined);

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
			const align = this.align();
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
