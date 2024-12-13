import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, effect, inject, input } from '@angular/core';
import { BRN_SLIDER, BRN_SLIDER_TRACK } from './brn-slider-track.directive';

@Directive({
	selector: '[brnSliderTickMark]',
	standalone: true,
})
export class BrnSliderTickMarkDirective {
	private readonly _platformId = inject(PLATFORM_ID);
	public readonly data = input<{ tickMarkIndex: number; totalTickMarks: number }>();

	private readonly _sliderTrack = inject(BRN_SLIDER_TRACK);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
	private readonly _slider = inject(BRN_SLIDER);

	constructor() {
		effect(() => {
			if (isPlatformBrowser(this._platformId)) {
				this._updateTranslateX();
			}
		});
	}

	private _updateTranslateX() {
		const data = this.data();

		if (!data) {
			return;
		}

		const translateX = data.tickMarkIndex * (this._sliderTrack.tickMarkTrackWidth() / (data.totalTickMarks - 1));

		this._elementRef.nativeElement.style.transform =
			this._slider.direction() === 'rtl' ? `translateX(${-translateX}px)` : `translateX(${translateX}px)`;
	}
}
