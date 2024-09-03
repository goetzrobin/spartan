import type { Direction } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';
import {
	Directive,
	ElementRef,
	InjectionToken,
	PLATFORM_ID,
	Renderer2,
	type Signal,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BRN_SLIDER } from './brn-slider.directive';

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
		role: 'slider',
		'(change)': 'onChange()',
		'(input)': 'onInput()',
		'(focus)': 'onFocus()',
		'(blur)': 'onBlur()',
		'[attr.disabled]': 'isDisabled()',
		'[attr.aria-valuenow]': 'valueNow()',
		'[attr.aria-valuemin]': 'valueMin()',
		'[attr.aria-valuemax]': 'valueMax()',
		'[attr.aria-labelledby]': 'ariaLabelledby()',
		'[attr.aria-label]': 'ariaLabel()',
		'aria-orientation': 'horizontal',
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
	private _onTouchedFn: () => void = () => {};
	protected isDisabled = computed(() => (this._slider.disabled() === true ? true : undefined));
	protected valueNow = computed(() => this.value() ?? 0);
	protected valueMin = computed(() => this._slider.min());
	protected valueMax = computed(() => this._slider.max());
	protected ariaLabelledby = computed(() => this._slider.label()?.id);
	protected ariaLabel = computed(() => {
		if (!this._slider.ariaLabel() && !this.ariaLabelledby()) {
			throw new Error(
				"'ariaLabel' input must be provided as fallback accessibility aria label when no aria-labelledby element is provided.",
			);
		}
		return this._slider.ariaLabel();
	});
	public readonly value = signal(0);
	public readonly isFocused = signal(false);

	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>);
	private readonly _slider = inject(BRN_SLIDER);
	private readonly _renderer2 = inject(Renderer2);

	constructor() {
		effect(
			() => {
				if (isPlatformBrowser(this._platformId)) {
					this._updateHostElementStep(this._slider.step());
					this._updateMinValue(this._slider.min());
					this._updateMaxValue(this._slider.max());
					this._updateDirection(this._slider.direction());
				}
			},
			{ allowSignalWrites: true },
		);
	}

	onFocus(): void {
		this.isFocused.set(true);
	}

	onBlur(): void {
		this.isFocused.set(false);
		this._onTouchedFn();
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

	registerOnTouched(fn: () => void): void {
		this._onTouchedFn = fn;
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
		this._elementRef.nativeElement.value = value?.toString() ?? '0';
	}

	private _updateValue() {
		this.value.set(+this._elementRef.nativeElement.value);
		this._onChangeFn?.(this.value());
	}

	private _updateHostElementStep(step: number) {
		this._elementRef.nativeElement.step = step.toString();
		this._updateValue();
	}

	private _updateMinValue(value: number) {
		this._elementRef.nativeElement.min = value.toString();
		this._updateValue();
	}

	private _updateMaxValue(value: number) {
		this._elementRef.nativeElement.max = value.toString();
		this._updateValue();
	}

	private _updateDirection(direction: Direction) {
		this._renderer2.setStyle(this._elementRef.nativeElement, 'direction', direction);
	}
}
