import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, Input, effect, inject, signal } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type BrnMenuAlign = 'start' | 'center' | 'end' | undefined;

@Directive({
	selector: '[brnMenuTriggerFor]',
	standalone: true,
	hostDirectives: [{ directive: CdkMenuTrigger, inputs: ['cdkMenuTriggerFor: brnMenuTriggerFor'] }],
})
export class BrnMenuTriggerDirective {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _align = signal<BrnMenuAlign>(undefined);

	/**
	 * OutputRef that emits when the trigger is closed.
	 * @type {OutputRef<void>}
	 */
	closed = outputFromObservable(this._cdkTrigger?.closed) ;

	/**
	 * OutputRef that emits when the trigger is opened.
	 * @type {OutputRef<void>}
	 */
	opened = outputFromObservable(this._cdkTrigger?.opened);

	@Input()
	set align(value: BrnMenuAlign) {
		this._align.set(value);
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
