import { AfterContentInit, AfterViewInit, Directive, ElementRef, InjectionToken, PLATFORM_ID, Signal, WritableSignal, afterNextRender, contentChild, inject, model, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { BRN_SLIDER_TRACK, BrnSliderTrack } from "./brn-slider-track.directive";

export const BRN_SLIDER = new InjectionToken<BrnSlider>('BrnSlider');

export interface BrnSlider {
    /** The minimun value of the slider. */
    min: WritableSignal<number>;

    /** The maximun value of the slider. */
    max: WritableSignal<number>;

    /** Whether the slider is disabled. */
    disabled: WritableSignal<boolean>;

    /** The host element's bounding client rect width. */
    hostElementWidth: Signal<number>;

    /** The underlying slider's track element */
    brnSliderTrack: Signal<BrnSliderTrack | undefined>;
};

@Directive({
    selector: '[brnSlider]',    
    standalone: true,    
    providers: [{
        provide: BRN_SLIDER,
        useExisting: BrnSliderDirective,          
    }],
    exportAs: 'brnSlider',
})
export class BrnSliderDirective implements BrnSlider, AfterViewInit {
    public readonly disabled = model<boolean>(false, { alias: 'brnSliderDisabled'});      
    public readonly min = model<number>(0);
    public readonly max = model<number>(100);      
    public readonly hostElementWidth = signal<number>(0);    

    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);    

    public readonly brnSliderTrack = contentChild(BRN_SLIDER_TRACK);        

    ngAfterViewInit(): void {        
        if (isPlatformBrowser(this._platformId)) {
            this._storeDimensions();
        }        
    }    
    
    private _storeDimensions(): void {        
        this.hostElementWidth.set(this._elementRef.nativeElement.offsetWidth);
    }
}