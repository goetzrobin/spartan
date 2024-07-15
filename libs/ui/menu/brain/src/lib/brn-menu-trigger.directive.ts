import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, Input, Output, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs'

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
	 * Observable that emits when the trigger is closed.
	 * @type {Observable<void>}
	 * @readonly
	 */
	readonly closed$: Observable<void> = this._cdkTrigger.closed.asObservable();

	/**
	 * Observable that emits when the trigger is opened.
	 * @type {Observable<void>}
	 * @readonly
	 */
	readonly opened$: Observable<void> = this._cdkTrigger.opened.asObservable(); 

	/**
	 * Event emitter that emits when the trigger is closed.
	 * @type {EventEmitter<void>}
	 */
	@Output() closed = this._cdkTrigger?.closed;

	/**
	 * Event emitter that emits when the trigger is opened.
	 * @type {EventEmitter<void>}
	 */
	@Output() opened = this._cdkTrigger?.opened;

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
