import type { Direction } from "@angular/cdk/bidi";
import { isPlatformBrowser } from "@angular/common";
import { Directive, ElementRef, InjectionToken, PLATFORM_ID, Renderer2, type Signal, computed, effect, inject, signal } from "@angular/core";
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BRN_SLIDER } from "./brn-slider.directive";

export const BRN_SLIDER_INPUT = new InjectionToken<BrnSliderInput>('BrnSliderInput');

export interface BrnSliderInput {
    /** The slider's native input element wrapper value. */
    value: Signal<number>;

    /** Flag indicating if native input element is currently focused. */
    isFocused: Signal<boolean>;
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
		'(focus)': 'onFocus()',
		'(blur)': 'onBlur()',
		'[attr.disabled]': 'isDisabled()',		
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: BrnSliderInputDirective,
			multi: true,
		},
		{
			provide: BRN_SLIDER_INPUT,
			useExisting: BrnSliderInputDirective,
		},
	],
	standalone: true,
})
export class BrnSliderInputDirective implements ControlValueAccessor, BrnSliderInput {
	private _onChangeFn: ((value: string | number) => void) | undefined;
	protected isDisabled = computed(() => (this._slider.disabled() === true ? true : undefined));
	public readonly value = signal(0);
	public readonly isFocused = signal(false);

	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>);
	private readonly _slider = inject(BRN_SLIDER);
	private readonly _renderer2 = inject(Renderer2);

	constructor() {
		effect(() => {
			if (isPlatformBrowser(this._platformId)) {
				this._updateHostElementValue(this._slider.min());
				this._updateMinValue(this._slider.min());
				this._updateMaxValue(this._slider.max());
				this._updateDirection(this._slider.direction());
			}
		});
	}

	onFocus(): void {		
		this.isFocused.set(true);
	}

	onBlur(): void {		
		this.isFocused.set(false);
	}

	onInput(): void {
		this._updateValue();
	}

	onChange(): void {
		this._updateValue();
	}

	writeValue(obj: number): void {        
		this.value.set(obj);
        this._updateHostElementValue(obj);
	}

	registerOnChange(fn: (value: string | number) => void): void {
		this._onChangeFn = fn;
	}

	registerOnTouched(fn: any): void {
		console.log('register on touch');
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

	private _updateHostElementValue(value: number | null) {
        if (!value && value !== 0) {
            return;
        }
        
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

	private _updateDirection(direction: Direction) {
		this._renderer2.setStyle(this._elementRef.nativeElement, 'direction', direction);
	}
}