import { Directive, ElementRef, InjectionToken, Signal, computed, effect, inject, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BRN_SLIDER } from "./brn-slider.directive";

export const BRN_SLIDER_INPUT = new InjectionToken<BrnSliderInput>('BrnSliderInput');

export interface BrnSliderInput {
    /** The slider's native input element wrapper value. */
    value: Signal<number>;
}

/**
 * Directive that adds slider-specific behaviors to an input element inside `<brn-slider>`.
 */
@Directive({
    selector: 'input[brnSliderInput]',
    host: {
        type: 'range',        
        '(change)': 'onChange()',
        '(input)': 'onInput()',   
        '[attr.disabled]': 'isDisabled()',
    },
    providers: [
        {            
            provide: NG_VALUE_ACCESSOR,
            useExisting: BrnSliderInputDirective,
            multi: true
        },
        {
            provide: BRN_SLIDER_INPUT,
            useExisting: BrnSliderInputDirective,        
        }
    ],
    standalone: true,      
})
export class BrnSliderInputDirective implements ControlValueAccessor {
    private _onChangeFn: ((value: string | number) => void) | undefined;                    
    protected isDisabled = computed(() => this._slider.disabled() === true ? true : undefined);
    public readonly value = signal(0);
    
    private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>);    
    private readonly _slider = inject(BRN_SLIDER);

    constructor()  {        
        effect(() => {
            this._updateHostElementValue(this._slider.min());
            this._updateMinValue(this._slider.min());
            this._updateMaxValue(this._slider.max());
        });        
    }    

    onInput() {
        this._updateValue();        
    }

    onChange() {                
        this._updateValue();               
    }

    writeValue(obj: number): void {               
        this.value.set(obj);        
    }

    registerOnChange(fn: (value: string | number) => void): void {
        this._onChangeFn = fn;        
    }

    registerOnTouched(fn: any): void {
        console.log('register on touch')
    }

    /**
     * Sets the disabled state of the slider.
     * @param isDisabled The new disabled state   
    */
    setDisabledState(isDisabled: boolean): void {
        /** Disable slider only when slider component 
         * is not disabled and isDisabled param is explicitly set to true
         */
        if (isDisabled && !this._slider.disabled()) {
            this._slider.disabled.set(isDisabled);       
        }                                         
    }

    private _updateHostElementValue(value: number) {        
        this._elementRef.nativeElement.value = value.toString();        
    }

    private _updateValue() {               
        this.value.set(+this._elementRef.nativeElement.value);       
        this._onChangeFn?.(this.value());        
    }

    private _updateMinValue(value: number) {        
        this._elementRef.nativeElement.min = value.toString();               
    }

    private _updateMaxValue(value: number) {        
        this._elementRef.nativeElement.max = value.toString();               
    }
}