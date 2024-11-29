/* eslint-disable @typescript-eslint/no-empty-function */
import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	Component,
	computed,
	contentChildren,
	forwardRef,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/ui-forms-brain';
import { provideBrnRadioGroupToken } from './brn-radio-group.token';
import { BrnRadioChange, BrnRadioComponent } from './brn-radio.component';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroupComponent),
	multi: true,
};

@Component({
	selector: 'brn-radio-group',
	standalone: true,
	providers: [BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, provideBrnRadioGroupToken(BrnRadioGroupComponent)],
	host: {
		role: 'radiogroup',
		'(focusout)': 'onTouched()',
	},
	template: '<ng-content />',
})
export class BrnRadioGroupComponent<T = unknown> implements ControlValueAccessor {
	private static _nextUniqueId = 0;

	protected onChange: ChangeFn<T> = () => {};

	protected onTouched: TouchFn = () => {};

	public readonly name = input(`brn-radio-group-${BrnRadioGroupComponent._nextUniqueId++}`);

	/**
	 * The value of the selected radio button.
	 */
	public readonly value = model<T>();

	/**
	 * Whether the radio group is disabled.
	 */
	public disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * Whether the radio group should be required.
	 */
	public readonly required = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * The direction of the radio group.
	 */
	public readonly direction = input<'ltr' | 'rtl' | null>('ltr');

	/**
	 * Event emitted when the group value changes.
	 */
	public readonly change = output<BrnRadioChange<T>>();

	/**
	 * The internal disabled state of the radio group. This could be switched to a linkedSignal when we can drop v18 support.
	 * @internal
	 */
	public readonly disabledState = computed(() => signal(this.disabled()));

	/**
	 * Access the radio buttons within the group.
	 * @internal
	 */
	public readonly radioButtons = contentChildren(BrnRadioComponent, { descendants: true });

	writeValue(value: T): void {
		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabledState().set(isDisabled);
	}

	/**
	 * Select a radio button.
	 * @internal
	 */
	select(radioButton: BrnRadioComponent<T>, value: T): void {
		if (this.value() === value) {
			return;
		}

		this.value.set(value);
		this.onChange(value);
		this.change.emit(new BrnRadioChange<T>(radioButton, value));
	}
}
