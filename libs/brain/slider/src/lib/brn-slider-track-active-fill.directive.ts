import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, effect, inject } from '@angular/core';
import { BRN_SLIDER_TRACK } from './brn-slider-track.directive';

@Directive({
	selector: '[brnSliderTrackActiveFill]',
	standalone: true,
})
export class BrnSliderTrackActiveFillDirective {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
	private readonly _sliderTrack = inject(BRN_SLIDER_TRACK);

	constructor() {
		effect(() => {
			if (isPlatformBrowser(this._platformId)) {
				this._updateActiveTrackPercentage(this._sliderTrack.activeTrackPercentage());
			}
		});
	}

	private _updateActiveTrackPercentage(percentage: number) {
		this._elementRef.nativeElement.style.transform = `scaleX(${percentage})`;
	}
}
