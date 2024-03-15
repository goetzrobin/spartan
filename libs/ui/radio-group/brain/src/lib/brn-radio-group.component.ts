import {
	AfterContentInit,
	booleanAttribute,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	EventEmitter,
	forwardRef,
	inject,
	Input,
	Output,
	QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnRadioChange } from './brn-radio-change';
import { BrnRadioComponent } from './brn-radio.component';

let nextUniqueId = 0;

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroupComponent),
	multi: true,
};

@Component({
	selector: 'brn-radio-group',
	standalone: true,
	providers: [BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
	imports: [],
	host: {
		role: 'radiogroup',
	},
	template: `
		<ng-content />
	`,
})
export class BrnRadioGroupComponent implements AfterContentInit {
	private _changeDetector = inject(ChangeDetectorRef);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _value: any = null;
	private _isInitialized = false;

	@ContentChildren(BrnRadioComponent, { descendants: true })
	private _radios?: QueryList<BrnRadioComponent>;

	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
	_controlValueAccessorChangeFn: (value: any) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
	onTouched: () => any = () => {};

	private _name = `brn-radio-group-${nextUniqueId++}`;
	@Input()
	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
		this._updateRadioButtonNames();
	}

	/**
	 * Value for the radio-group. Should equal the value of the selected radio button if there is
	 * a corresponding radio button with a matching value. If there is not such a corresponding
	 * radio button, this value persists to be applied in case a new radio button is added with a
	 * matching value.
	 */
	@Input()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get value(): any {
		return this._value;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	set value(newValue: any) {
		if (this._value !== newValue) {
			// Set this before proceeding to ensure no circular loop occurs with selection.
			this._value = newValue;
			this._updateSelectedRadioFromValue();
			this._checkSelectedRadioButton();
		}
	}

	_checkSelectedRadioButton() {
		if (this._selected && !this._selected.checked) {
			this._selected.checked = true;
		}
	}

	/**
	 * The currently selected radio button. If set to a new radio button, the radio group value
	 * will be updated to match the new selected button.
	 */
	private _selected: BrnRadioComponent | null = null;
	@Input()
	get selected() {
		return this._selected;
	}

	set selected(selected: BrnRadioComponent | null) {
		this._selected = selected;
		this.value = selected ? selected.value : null;
		this._checkSelectedRadioButton();
	}

	private _disabled = false;
	@Input({ transform: booleanAttribute })
	get disabled(): boolean {
		return this._disabled;
	}

	set disabled(value: boolean) {
		this._disabled = value;
		this._markRadiosForCheck();
	}

	private _required = false;
	@Input({ transform: booleanAttribute })
	get required(): boolean {
		return this._required;
	}

	set required(value: boolean) {
		this._required = value;
		this._markRadiosForCheck();
	}

	@Input()
	direction: 'ltr' | 'rtl' | null = 'ltr';

	@Output()
	// eslint-disable-next-line @angular-eslint/no-output-native
	readonly change: EventEmitter<BrnRadioChange> = new EventEmitter<BrnRadioChange>();

	/**
	 * Initialize properties once content children are available.
	 * This allows us to propagate relevant attributes to associated buttons.
	 */
	ngAfterContentInit() {
		// Mark this component as initialized in AfterContentInit because the initial value can
		// possibly be set by NgModel on MatRadioGroup, and it is possible that the OnInit of the
		// NgModel occurs *after* the OnInit of the MatRadioGroup.
		this._isInitialized = true;
	}

	/**
	 * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
	 * radio buttons upon their blur.
	 */
	_touch() {
		if (this.onTouched) {
			this.onTouched();
		}
	}

	private _updateRadioButtonNames(): void {
		if (this._radios) {
			this._radios.forEach((radio) => {
				radio.name = this.name;
				radio._markForCheck();
			});
		}
	}

	/** Updates the `selected` radio button from the internal _value state. */
	private _updateSelectedRadioFromValue(): void {
		// If the value already matches the selected radio, do nothing.
		const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

		if (this._radios && !isAlreadySelected) {
			this._selected = null;
			this._radios.forEach((radio) => {
				radio.checked = this.value === radio.value;
				if (radio.checked) {
					this._selected = radio;
				}
			});
		}
	}

	_emitChangeEvent(): void {
		if (this._isInitialized) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.change.emit(new BrnRadioChange(this._selected!, this._value));
		}
	}

	_markRadiosForCheck() {
		if (this._radios) {
			this._radios.forEach((radio) => radio._markForCheck());
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	writeValue(value: any) {
		this.value = value;
		this._changeDetector.markForCheck();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnChange(fn: (value: any) => void) {
		this._controlValueAccessorChangeFn = fn;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
		this._changeDetector.markForCheck();
	}
}
