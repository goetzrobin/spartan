import { Directive, ElementRef, forwardRef, Inject, Input, OnDestroy, Optional, Provider } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateAdapter } from './date-adapter';
import { HLM_DATE_FORMATS, HlmDateFormats } from './date-formats';
import { DateSelectionModelChange } from './date-selection-model';
import { HlmDatepickerControl, HlmDatepickerPanel } from './datepicker-content';
import { DateFilterFn, HlmDatepickerInputBaseDirective } from './datepicker-input-base';

export const DATEPICKER_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatepickerInputDirective),
	multi: true,
};

export const DATEPICKER_VALIDATORS: Provider = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => HlmDatepickerInputDirective),
	multi: true,
};

/** Directive used to connect an input to a MatDatepicker. */
@Directive({
	selector: 'input[hlmDatepicker]',
	providers: [DATEPICKER_VALUE_ACCESSOR, DATEPICKER_VALIDATORS],
	host: {
		class: 'mat-datepicker-input',
		'[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
		'[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
		'[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
		'[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
		// Used by the test harness to tie this input to its calendar. We can't depend on
		// `aria-owns` for this, because it's only defined while the calendar is open.
		'[attr.data-mat-calendar]': '_datepicker ? _datepicker.id : null',
		'[disabled]': 'disabled',
		'(input)': '_onInput($event.target.value)',
		'(change)': '_onChange()',
		'(blur)': '_onBlur()',
		'(keydown)': '_onKeydown($event)',
	},
	exportAs: 'hlmDatepickerInput',
	standalone: true,
})
export class HlmDatepickerInputDirective<D>
	extends HlmDatepickerInputBaseDirective<D | null, D>
	implements HlmDatepickerControl<D | null>, OnDestroy
{
	private _closedSubscription = Subscription.EMPTY;

	/** The datepicker that this input is associated with. */
	@Input()
	set hlmDatepicker(datepicker: HlmDatepickerPanel<HlmDatepickerControl<D>, D | null, D>) {
		if (datepicker) {
			this._datepicker = datepicker;
			this._closedSubscription = datepicker.closedStream.subscribe(() => this._onTouched());
			this._registerModel(datepicker.registerInput(this));
		}
	}
	_datepicker!: HlmDatepickerPanel<HlmDatepickerControl<D>, D | null, D>;

	/** The minimum valid date. */
	@Input()
	get min(): D | null {
		return this._min;
	}
	set min(value: D | null) {
		const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

		if (!this._dateAdapter.sameDate(validValue, this._min)) {
			this._min = validValue;
			this._validatorOnChange();
		}
	}
	private _min: D | null = null;

	/** The maximum valid date. */
	@Input()
	get max(): D | null {
		return this._max;
	}
	set max(value: D | null) {
		const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

		if (!this._dateAdapter.sameDate(validValue, this._max)) {
			this._max = validValue;
			this._validatorOnChange();
		}
	}
	private _max: D | null = null;

	/** Function that can be used to filter out dates within the datepicker. */
	@Input('datepickerFilter')
	get dateFilter() {
		return this._dateFilter;
	}
	set dateFilter(value: DateFilterFn<D | null>) {
		const wasMatchingValue = this._matchesFilter(this.value);
		this._dateFilter = value;

		if (this._matchesFilter(this.value) !== wasMatchingValue) {
			this._validatorOnChange();
		}
	}
	private _dateFilter!: DateFilterFn<D | null>;

	/** The combined form control validator for this input. */
	protected _validator: ValidatorFn | null;

	constructor(
		elementRef: ElementRef<HTMLInputElement>,
		@Optional() dateAdapter: DateAdapter<D>,
		@Optional() @Inject(HLM_DATE_FORMATS) dateFormats: HlmDateFormats,
	) {
		super(elementRef, dateAdapter, dateFormats);
		this._validator = Validators.compose(super._getValidators());
	}

	/** Gets the value at which the calendar should start. */
	getStartValue(): D | null {
		return this.value;
	}

	override ngOnDestroy() {
		super.ngOnDestroy();
		this._closedSubscription.unsubscribe();
	}

	/** Opens the associated datepicker. */
	protected _openPopup(): void {
		if (this._datepicker) {
			this._datepicker.open();
		}
	}

	protected _getValueFromModel(modelValue: D | null): D | null {
		return modelValue;
	}

	protected _assignValueToModel(value: D | null): void {
		if (this._model) {
			this._model.updateSelection(value, this);
		}
	}

	/** Gets the input's minimum date. */
	_getMinDate() {
		return this._min;
	}

	/** Gets the input's maximum date. */
	_getMaxDate() {
		return this._max;
	}

	/** Gets the input's date filtering function. */
	protected _getDateFilter() {
		return this._dateFilter;
	}

	protected _shouldHandleChangeEvent(event: DateSelectionModelChange<D>) {
		return event.source !== this;
	}
}
