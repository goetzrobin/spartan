import { isPlatformBrowser } from "@angular/common";
import { Directive, ElementRef, PLATFORM_ID, type Signal, computed, effect, inject } from "@angular/core";
import { BRN_SLIDER } from "./brn-slider.directive";

export interface BrnSliderThumb {
    /** The visual's thumb translateX portion. */
    translateX: Signal<number>;
}

@Directive({
    selector: '[brnSliderThumb]',    
    standalone: true,     
})
export class BrnSliderThumbDirective implements BrnSliderThumb {
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
    private readonly _slider = inject(BRN_SLIDER);

    public readonly translateX = computed(() => this._calcTranslateX());

    constructor() {
        effect(() => {
            if (isPlatformBrowser(this._platformId)) {                
                this._updateTranslateX(this.translateX());
            }
        });
    }

    private _calcTranslateX() {
        const activeTrackPercentage = this._slider.brnSliderTrack()?.activeTrackPercentage();

        if (!activeTrackPercentage) {
            return 0;
        }
        
        if (this._slider.direction() === 'rtl') {
			return -(activeTrackPercentage * this._slider.hostElementWidth());
		}

        return activeTrackPercentage * this._slider.hostElementWidth();
    }

    private _updateTranslateX(value: number) {        
        this._elementRef.nativeElement.style.transform = `translate(${value}px, -50%)`;
    }
}