import { Directive, ElementRef, type Signal, computed, effect, inject } from "@angular/core";
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
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
    private readonly _slider = inject(BRN_SLIDER);

    public readonly translateX = computed(() => (this._slider.brnSliderTrack()?.activeTrackPercentage() ?? 0) * this._slider.hostElementWidth());

    constructor() {
        effect(() => this.updateTranslateX(this.translateX()));
    }

    updateTranslateX(value: number) {                
        this._elementRef.nativeElement.style.transform = `translate(${value}px, -50%)`;
    }
}