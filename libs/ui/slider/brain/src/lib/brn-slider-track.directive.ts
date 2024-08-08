import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { isPlatformBrowser } from '@angular/common';
import {
	Directive,
	ElementRef,
	InjectionToken,
	PLATFORM_ID,
	computed,
	contentChild,
	forwardRef,
	inject,
	signal,
	type AfterViewInit,
	type Signal,
} from '@angular/core';
import { Subject, debounceTime, takeUntil, tap } from 'rxjs';
import { BRN_SLIDER_INPUT, type BrnSliderInput } from './brn-slider-input.directive';
import { BRN_SLIDER } from './brn-slider.directive';

export const BRN_SLIDER_TRACK = new InjectionToken<BrnSliderTrack>('BrnSliderTrack');

export interface BrnSliderTrack {
	/** The track's active portion. */
	activeTrackPercentage: Signal<number>;

	/** The host element's bounding client rect width without padding left and right. */
	hostElementWidth: Signal<number>;

	/** The available tick mark track width based on slider's step min and max values. */
	tickMarkTrackWidth: Signal<number>;

	/** The tick marks array indicating if a mark is currently active or inactive. */
	tickMarks: Signal<Array<boolean>>;

	/** The underlying slider's track input element */
	brnSliderInput: Signal<BrnSliderInput | undefined>;
}

@Directive({
	selector: '[brnSliderTrack]',
	standalone: true,
	providers: [
		{
			provide: BRN_SLIDER_TRACK,
			useExisting: BrnSliderTrackDirective,
		},
	],
})
export class BrnSliderTrackDirective implements BrnSliderTrack, AfterViewInit {
	public readonly hostElementWidth = signal<number>(0);
	private readonly _destroyed = new Subject<void>();

	private readonly _slider = inject(BRN_SLIDER);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
	private readonly _sharedResizeObserver = inject(SharedResizeObserver);

	public readonly brnSliderInput = contentChild<BrnSliderInput>(forwardRef(() => BRN_SLIDER_INPUT));

	public activeTrackPercentage = computed(() => {
		const inputValue = this.brnSliderInput()?.value();

		if (this._slider.min() >= this._slider.max() || !inputValue || inputValue < this._slider.min()) {
			return 0;
		}

		if (inputValue > this._slider.max()) {
			return 1;
		}

		return (inputValue - this._slider.min()) / (this._slider.max() - this._slider.min());
	});

	public tickMarkTrackWidth = computed(() => {
		if (!this._slider.showTickMarks()) {
			return 0;
		}

		const sliderStep = this._slider.step();
		const sliderMax = this._slider.max();
		const sliderMin = this._slider.min();

		const step = sliderStep && sliderStep > 0 ? sliderStep : 1;
		const maxValue = Math.floor((sliderMax - sliderMin) / step) * step + sliderMin;
		const percentage = (maxValue - sliderMin) / (sliderMax - sliderMin);

		return this.hostElementWidth() * percentage;
	});

	public tickMarks = computed(() => {
		const inputValue = this.brnSliderInput()?.value();

		if (!this._slider.showTickMarks() || inputValue === null || inputValue === undefined) {
			return [];
		}

		let numActive = Math.max(Math.floor((inputValue - this._slider.min()) / this._slider.step()), 0);
		let numInactive = Math.max(Math.floor((this._slider.max() - inputValue) / this._slider.step()), 0);

		this._slider.direction() === 'rtl' ? numInactive++ : numActive++;

		return Array(numActive).fill(true).concat(Array(numInactive).fill(false));
	});

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this._platformId)) {
			this._storeDimensions();
			this._onResize();
		}
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	private _onResize() {
		this._sharedResizeObserver
			.observe(this._elementRef.nativeElement)
			.pipe(
				debounceTime(32),
				takeUntil(this._destroyed),
				tap(() => this._storeDimensions()),
			)
			.subscribe();
	}

	private _storeDimensions(): void {
		const computedStyle = getComputedStyle(this._elementRef.nativeElement);

		this.hostElementWidth.set(
			this._elementRef.nativeElement.offsetWidth -
				Number.parseFloat(computedStyle.paddingLeft) -
				Number.parseFloat(computedStyle.paddingRight),
		);
	}
}
