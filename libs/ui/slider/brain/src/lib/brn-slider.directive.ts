import { type Direction, Directionality } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	Directive,
	InjectionToken,
	Injector,
	type OnDestroy,
	PLATFORM_ID,
	type Signal,
	type WritableSignal,
	contentChild,
	inject,
	input,
	model,
	signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { Subject, merge, takeUntil, tap } from 'rxjs';
import { BRN_SLIDER_TRACK, type BrnSliderTrack } from './brn-slider-track.directive';

export const BRN_SLIDER = new InjectionToken<BrnSlider>('BrnSlider');

export interface BrnSlider {
	/** The minimun value of the slider. */
	min: WritableSignal<number>;

	/** The maximun value of the slider. */
	max: WritableSignal<number>;

	/** The amount that slider values can increment or decrement by. */
	step: Signal<number>;

	/** Whether the slider is disabled. */
	disabled: WritableSignal<boolean>;

	/** Whether the slider displays tick marks along the slider track. */
	showTickMarks: Signal<boolean>;

	/** Whether the slider is ltr or rtl.
	 * Any consumer of slider interested in getting the current
	 * direction state, will consume this signal.
	 */
	direction: Signal<Direction>;

	/** The underlying slider's track element */
	brnSliderTrack: Signal<BrnSliderTrack | undefined>;

	/** The aria-labelledby element */
	label: Signal<BrnLabelDirective | null>;

	/** The optional aria-label fallback value.
	 * If no label is provided, this input must be provided by the user,
	 * otherwise an error will be displayed prompting the user to either
	 * provide a spartan-ui label or a fallback aria label text.
	 */
	ariaLabel: Signal<string | null>;
}

@Directive({
	selector: '[brnSlider]',
	standalone: true,
	providers: [
		{
			provide: BRN_SLIDER,
			useExisting: BrnSliderDirective,
		},
	],
	exportAs: 'brnSlider',
})
export class BrnSliderDirective implements BrnSlider, AfterViewInit, OnDestroy {
	public readonly label = input<BrnLabelDirective | null>(null);
	public readonly ariaLabel = input<string | null>(null);
	/** Used only as an input. */
	public readonly dir = input<Direction>('ltr');
	public readonly disabled = model<boolean>(false, { alias: 'brnSliderDisabled' });
	public readonly min = model<number>(0);
	public readonly max = model<number>(100);
	public readonly step = input<number>(1);
	public readonly showTickMarks = input<boolean>(false);

	public readonly direction = signal<Direction>('ltr');
	private readonly _destroyed = new Subject<void>();

	private readonly _injector = inject(Injector);
	private readonly _dir = inject(Directionality);
	private readonly _platformId = inject(PLATFORM_ID);

	public readonly brnSliderTrack = contentChild(BRN_SLIDER_TRACK);

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this._platformId)) {
			this._updateDirectionality();
		}
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	/**
	 * The method is responsible of setting the current direction state
	 * based on the latest 'dir' input or bidi state change. The only
	 * source of truth for slider direction state is the 'direction' signal
	 * and all interested consumers of it, will consume this interface exposed signal.
	 */
	private _updateDirectionality() {
		merge(toObservable(this.dir, { injector: this._injector }), this._dir.change)
			.pipe(
				takeUntil(this._destroyed),
				tap((dir) => this.direction.set(dir)),
			)
			.subscribe();
	}
}
