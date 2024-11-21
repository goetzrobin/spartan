import { FocusMonitor, type FocusOrigin, type FocusableOption } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
	type AfterContentInit,
	type AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	type DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	type OnDestroy,
	type OnInit,
	Output,
	type QueryList,
	ViewChild,
	ViewEncapsulation,
	booleanAttribute,
	forwardRef,
	inject,
	numberAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroupComponent),
	multi: true,
};

export class BrnRadioChange {
	constructor(
		public source: BrnRadioComponent,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public value: any,
	) {}
}

@Component({
	selector: 'brn-radio',
	standalone: true,
	imports: [],
	host: {
		class: 'brn-radio',
		'[attr.id]': 'id',
		'[class.brn-radio-checked]': 'checked',
		'[class.brn-radio-disabled]': 'disabled',
		'[attr.data-checked]': 'checked',
		'[attr.data-disabled]': 'disabled',
		'[attr.data-value]': 'value',
		// Needs to be removed since it causes some a11y issues (see #21266).
		'[attr.tabindex]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-describedby]': 'null',
		// Note: under normal conditions focus shouldn't land on this element, however it may be
		// programmatically set, for example inside of a focus trap, in this case we want to forward
		// the focus to the native element.
		'(focus)': '_inputElement.nativeElement.focus()',
	},
	exportAs: 'brnRadio',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="display: flex; height: fit-content; width: fit-content" (click)="_onTouchTargetClick($event)">
			<ng-content select="[target],[indicator]" />
		</div>
		<input
			#input
			style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
			type="radio"
			[id]="inputId"
			[checked]="checked"
			[disabled]="disabled"
			[attr.name]="name"
			[attr.value]="value"
			[required]="required"
			[attr.aria-label]="ariaLabel"
			[attr.aria-labelledby]="ariaLabelledby"
			[attr.aria-describedby]="ariaDescribedby"
			(change)="_onInputInteraction($event)"
			(click)="_onInputClick($event)"
		/>
		<label style="display: flex; height: fit-content; width: fit-content" [for]="inputId">
			<ng-content></ng-content>
		</label>
	`,
})
export class BrnRadioComponent implements FocusableOption, OnInit, AfterViewInit, DoCheck, OnDestroy {
	private static _nextUniqueId = 0;
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _elementRef = inject(ElementRef);
	private readonly _radioDispatcher = inject(UniqueSelectionDispatcher);
	protected _changeDetector = inject(ChangeDetectorRef);
	public radioGroup = inject(BrnRadioGroupComponent, { optional: true });

	private _disabled = false;
	@Input({ transform: booleanAttribute })
	public get disabled(): boolean {
		return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
	}
	public set disabled(value: boolean) {
		this._setDisabled(value);
	}

	private _defaultTabIndex = 0;
	@Input({ transform: numberAttribute })
	public set defaultTabIndex(value: number) {
		this._defaultTabIndex = value;
	}

	private _tabIndex = 0;
	@Input({ transform: numberAttribute })
	public get tabIndex(): number {
		return this.disabled ? -1 : this._tabIndex;
	}
	public set tabIndex(value: number) {
		this._tabIndex = value !== null ? value : this._defaultTabIndex;
	}

	private readonly _uniqueId = `brn-radio-${++BrnRadioComponent._nextUniqueId}`;

	@Input()
	public id = this._uniqueId;
	// will be overwritten with radio group name if group exists
	@Input()
	public name = this._uniqueId;
	@Input('aria-label')
	public ariaLabel?: string;
	@Input('aria-labelledby')
	public ariaLabelledby?: string;
	@Input('aria-describedby')
	public ariaDescribedby?: string;

	private _checked = false;
	@Input({ transform: booleanAttribute })
	public get checked(): boolean {
		return this._checked;
	}

	public set checked(value: boolean) {
		const newCheckedState = value;
		if (this._checked !== newCheckedState) {
			this._checked = newCheckedState;
			if (newCheckedState && this.radioGroup && this.radioGroup.value !== this.value) {
				this.radioGroup.selected = this;
			} else if (!newCheckedState && this.radioGroup && this.radioGroup.value === this.value) {
				// When unchecking the selected radio button, update the selected radio
				// property on the group.
				this.radioGroup.selected = null;
			}

			if (newCheckedState) {
				// Notify all radio buttons with the same name to un-check.
				this._radioDispatcher.notify(this.id, this.name);
			}
			this._changeDetector.markForCheck();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _value: any = null;
	@Input({ required: true }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get value(): any {
		return this._value;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public set value(value: any) {
		if (this._value !== value) {
			this._value = value;
			if (this.radioGroup !== null) {
				if (!this.checked) {
					// Update checked when the value changed to match the radio group's value
					this.checked = this.radioGroup.value === value;
				}
				if (this.checked) {
					this.radioGroup.selected = this;
				}
			}
		}
	}

	private _required = false;
	@Input({ transform: booleanAttribute })
	public get required(): boolean {
		return this._required || (this.radioGroup !== null && this.radioGroup.required);
	}

	public set required(value: boolean) {
		this._required = value;
	}

	@Output()
	// eslint-disable-next-line @angular-eslint/no-output-native
	public readonly change = new EventEmitter<BrnRadioChange>();

	public get inputId(): string {
		return `${this.id || this._uniqueId}-input`;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _removeUniqueSelectionListener: () => void = () => {};

	private _previousTabIndex: number | undefined;

	@ViewChild('input')
	public _inputElement?: ElementRef<HTMLInputElement>;

	/** Focuses the radio button. */
	focus(origin?: FocusOrigin): void {
		if (!this._inputElement) return;
		if (origin) {
			this._focusMonitor.focusVia(this._inputElement, origin);
		} else {
			this._inputElement.nativeElement.focus();
		}
	}

	_markForCheck() {
		this._changeDetector.markForCheck();
	}

	ngOnInit() {
		if (this.radioGroup) {
			// If the radio is inside a radio group, determine if it should be checked
			this.checked = this.radioGroup.value === this._value;

			if (this.checked) {
				this.radioGroup.selected = this;
			}

			// Copy name from parent radio group
			this.name = this.radioGroup.name;
		}

		this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
			if (id !== this.id && name === this.name) {
				this.checked = false;
			}
		});
	}

	ngDoCheck(): void {
		this._updateTabIndex();
	}

	ngAfterViewInit() {
		this._updateTabIndex();
		this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
			if (!focusOrigin && this.radioGroup) {
				this.radioGroup._touch();
			}
		});
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
		this._removeUniqueSelectionListener();
	}

	/** Dispatch change event with current value. */
	private _emitChangeEvent(): void {
		this.change.emit(new BrnRadioChange(this, this._value));
	}

	_onInputClick(event: Event) {
		// We have to stop propagation for click events on the visual hidden input element.
		// By default, when a user clicks on a label element, a generated click event will be
		// dispatched on the associated input element. Since we are using a label element as our
		// root container, the click event on the `radio-button` will be executed twice.
		// The real click event will bubble up, and the generated click event also tries to bubble up.
		// This will lead to multiple click events.
		// Preventing bubbling for the second event will solve that issue.
		event.stopPropagation();
	}

	_onInputInteraction(event: Event) {
		// We always have to stop propagation on the change event.
		// Otherwise the change event, from the input element, will bubble up and
		// emit its event object to the `change` output.
		event.stopPropagation();

		if (!this.checked && !this.disabled) {
			const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
			this.checked = true;
			this._emitChangeEvent();

			if (this.radioGroup) {
				this.radioGroup._controlValueAccessorChangeFn(this.value);
				if (groupValueChanged) {
					this.radioGroup._emitChangeEvent();
				}
			}
		}
	}

	/** Triggered when the user clicks on the touch target. */
	_onTouchTargetClick(event: Event) {
		this._onInputInteraction(event);

		if (!this.disabled && this._inputElement) {
			// Normally the input should be focused already, but if the click
			// comes from the touch target, then we might have to focus it ourselves.
			this._inputElement.nativeElement.focus();
		}
	}

	protected _setDisabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value;
			this._changeDetector.markForCheck();
		}
	}

	private _updateTabIndex() {
		const group = this.radioGroup;
		let value: number;

		// Implement a roving tabindex if the button is inside a group. For most cases this isn't
		// necessary, because the browser handles the tab order for inputs inside a group automatically,
		// but we need an explicitly higher tabindex for the selected button in order for things like
		// the focus trap to pick it up correctly.
		if (!group || !group.selected || this.disabled) {
			value = this.tabIndex;
		} else {
			value = group.selected === this ? this.tabIndex : -1;
		}

		if (value !== this._previousTabIndex) {
			// We have to set the tabindex directly on the DOM node, because it depends on
			// the selected state which is prone to "changed after checked errors".
			const input: HTMLInputElement | undefined = this._inputElement?.nativeElement;

			if (input) {
				input.setAttribute('tabindex', `${value}`);
				this._previousTabIndex = value;
			}
		}
	}
}

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
	private static _nextUniqueId = 0;
	private readonly _changeDetector = inject(ChangeDetectorRef);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _value: any = null;
	private _isInitialized = false;

	@ContentChildren(BrnRadioComponent, { descendants: true })
	private readonly _radios?: QueryList<BrnRadioComponent>;

	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
	public _controlValueAccessorChangeFn: (value: any) => void = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
	public onTouched: () => any = () => {};

	private _name = `brn-radio-group-${BrnRadioGroupComponent._nextUniqueId++}`;
	@Input()
	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
		this._updateRadioButtonNames();
	}

	/**
	 * Value for the radio-group. Should equal the value of the selected radio button if there is
	 * a corresponding radio button with a matching value. If there is not such a corresponding
	 * radio button, this value persists to be applied in case a new radio button is added with a
	 * matching value.
	 */
	@Input() // eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get value(): any {
		return this._value;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public set value(newValue: any) {
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
	public get selected() {
		return this._selected;
	}

	public set selected(selected: BrnRadioComponent | null) {
		this._selected = selected;
		this.value = selected ? selected.value : null;
		this._checkSelectedRadioButton();
	}

	private _disabled = false;
	@Input({ transform: booleanAttribute })
	public get disabled(): boolean {
		return this._disabled;
	}

	public set disabled(value: boolean) {
		this._disabled = value;
		this._markRadiosForCheck();
	}

	private _required = false;
	@Input({ transform: booleanAttribute })
	public get required(): boolean {
		return this._required;
	}

	public set required(value: boolean) {
		this._required = value;
		this._markRadiosForCheck();
	}

	@Input()
	public direction: 'ltr' | 'rtl' | null = 'ltr';

	@Output()
	// eslint-disable-next-line @angular-eslint/no-output-native
	public readonly change: EventEmitter<BrnRadioChange> = new EventEmitter<BrnRadioChange>();

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
			for (const radio of this._radios) {
				radio.name = this.name;
				radio._markForCheck();
			}
		}
	}

	/** Updates the `selected` radio button from the internal _value state. */
	private _updateSelectedRadioFromValue(): void {
		// If the value already matches the selected radio, do nothing.
		const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

		if (this._radios && !isAlreadySelected) {
			this._selected = null;
			for (const radio of this._radios) {
				radio.checked = this.value === radio.value;
				if (radio.checked) {
					this._selected = radio;
				}
			}
		}
	}

	_emitChangeEvent(): void {
		if (this._isInitialized) {
			this.change.emit(new BrnRadioChange(this._selected!, this._value));
		}
	}

	_markRadiosForCheck() {
		if (this._radios) {
			for (const radio of this._radios) {
				radio._markForCheck();
			}
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
