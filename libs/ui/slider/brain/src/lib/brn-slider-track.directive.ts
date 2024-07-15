import { Directive, InjectionToken, type Signal, computed, contentChild, forwardRef, inject } from "@angular/core";
import { BRN_SLIDER_INPUT, type BrnSliderInput } from "./brn-slider-input.directive";
import { BRN_SLIDER } from "./brn-slider.directive";

export const BRN_SLIDER_TRACK = new InjectionToken<BrnSliderTrack>('BrnSliderTrack');

export interface BrnSliderTrack {
    /** The track's active portion. */
    activeTrackPercentage: Signal<number>;

    /** The underlying slider's track input element */
    brnSliderInput: Signal<BrnSliderInput | undefined>;
};

@Directive({
    selector: '[brnSliderTrack]',    
    standalone: true,        
    providers: [{
        provide: BRN_SLIDER_TRACK,
        useExisting: BrnSliderTrackDirective,          
    }],   
})
export class BrnSliderTrackDirective implements BrnSliderTrack {
    private readonly _slider = inject(BRN_SLIDER);

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
}