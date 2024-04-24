import { FocusMonitor, type FocusOrigin, type FocusableOption } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	type DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	type OnDestroy,
	type OnInit,
	Output,
	ViewChild,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	numberAttribute,
} from '@angular/core';
import { BrnRadioChange } from './brn-radio-change';
import { BrnRadioGroupComponent } from './brn-radio-group.component';

let nextUniqueId = 0;

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
	private _focusMonitor = inject(FocusMonitor);
	private _elementRef = inject(ElementRef);
	private _radioDispatcher = inject(UniqueSelectionDispatcher);
	protected _changeDetector = inject(ChangeDetectorRef);
	public radioGroup = inject(BrnRadioGroupComponent, { optional: true });

	private _disabled = false;
	@Input({ transform: booleanAttribute })
	get disabled(): boolean {
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
	}
	set disabled(value: boolean) {
		this._setDisabled(value);
	}

	private _defaultTabIndex = 0;
	@Input({ transform: numberAttribute })
	set defaultTabIndex(value: number) {
		this._defaultTabIndex = value;
	}

	private _tabIndex = 0;
	@Input({ transform: numberAttribute })
	get tabIndex(): number {
		return this.disabled ? -1 : this._tabIndex;
	}
	set tabIndex(value: number) {
		this._tabIndex = value !== null ? value : this._defaultTabIndex;
	}

	private _uniqueId = `brn-radio-${++nextUniqueId}`;

	@Input()
	id = this._uniqueId;
	// will be overwritten with radio group name if group exists
	@Input()
	name = this._uniqueId;
	@Input('aria-label')
	ariaLabel?: string;
	@Input('aria-labelledby')
	ariaLabelledby?: string;
	@Input('aria-describedby')
	ariaDescribedby?: string;

	private _checked = false;
	@Input({ transform: booleanAttribute })
	get checked(): boolean {
		return this._checked;
	}

	set checked(value: boolean) {
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
	get value(): any {
		return this._value;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	set value(value: any) {
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
	get required(): boolean {
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		return this._required || (this.radioGroup !== null && this.radioGroup.required);
	}

	set required(value: boolean) {
		this._required = value;
	}

	@Output()
	// eslint-disable-next-line @angular-eslint/no-output-native
	readonly change = new EventEmitter<BrnRadioChange>();

	get inputId(): string {
		return `${this.id || this._uniqueId}-input`;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _removeUniqueSelectionListener: () => void = () => {};

	private _previousTabIndex: number | undefined;

	@ViewChild('input')
	_inputElement?: ElementRef<HTMLInputElement>;

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
