import { Directive, ElementRef, effect, inject } from "@angular/core";
import { BRN_SLIDER_TRACK } from "./brn-slider-track.directive";

@Directive({
    selector: '[brnSliderTrackActiveFill]',    
    standalone: true,     
})
export class BrnSliderTrackActiveFillDirective {
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
    private readonly _sliderTrack = inject(BRN_SLIDER_TRACK);

    constructor() {
        effect(() => {            
            this.updateActiveTrackPercentage(this._sliderTrack.activeTrackPercentage());                
        });
    }    

    updateActiveTrackPercentage(percentage: number) {        
        this._elementRef.nativeElement.style.transform = `scaleX(${percentage})`;
    }
}