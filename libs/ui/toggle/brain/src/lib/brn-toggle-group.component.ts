import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { BrnToggleDirective } from './brn-toggle.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ToggleSyncable } from './toggle-syncable';
import { ToggleGroupCanBeNullableProvider } from './toggle-group-can-be-nullable-provider';

export const BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BrnToggleGroupComponent),
  multi: true,
};

let uniqueIdCounter = 0;
export class BrnButtonToggleChange {
  constructor(
    public source: BrnToggleDirective,
    public value: any,
  ) {}
}

@Component({
  selector: 'brn-toggle-group',
  standalone: true,
  providers: [
    BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
    {
      provide: ToggleSyncable,
      useExisting: forwardRef(() => BrnToggleGroupComponent),
    },
    {
      provide: ToggleGroupCanBeNullableProvider,
      useExisting: forwardRef(() => BrnToggleGroupComponent),
    },
  ],
  host: {
    role: 'group',
    class: 'brn-button-toggle-group',
    '[attr.aria-disabled]': 'disabled',
    '[attr.data-disabled]': 'disabled',
    '[attr.data-vertical]': 'vertical',
  },
  exportAs: 'brnToggleGroup',
  template: `<ng-content />`,
})
export class BrnToggleGroupComponent
  implements ControlValueAccessor, OnInit, AfterContentInit, ToggleSyncable, ToggleGroupCanBeNullableProvider
{
  private _changeDetector = inject(ChangeDetectorRef);
  private _vertical = false;
  private _multiple = false;
  private _nullable = false;
  private _skipNullableCheck = false;
  private _disabled = false;
  private _selectionModel?: SelectionModel<BrnToggleDirective>;

  /**
   * Reference to the raw value that the consumer tried to assign. The real
   * value will exclude any values from this one that don't correspond to a
   * toggle. Useful for the cases where the value is assigned before the toggles
   * have been initialized or at the same that they're being swapped out.
   */
  private _rawValue: any;

  /**
   * The method to be called in order to update ngModel.
   * Now `ngModel` binding is not supported in multiple selection mode.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched: () => any = () => {};

  @ContentChildren(BrnToggleDirective, {
    // Note that this would technically pick up toggles
    // from nested groups, but that's not a case that we support.
    descendants: true,
  })
  _buttonToggles?: QueryList<BrnToggleDirective>;

  private _name = `brn-button-toggle-group-${uniqueIdCounter++}`;
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._markTogglesForCheck();
  }

  @Input()
  get vertical(): boolean {
    return this._vertical;
  }
  set vertical(value: BooleanInput) {
    this._vertical = coerceBooleanProperty(value);
  }

  /** Value of the toggle group. */
  @Input()
  get value(): any {
    const selected = this._selectionModel ? this._selectionModel.selected : [];

    if (this.multiple) {
      return selected.map((toggle) => toggle.value);
    }

    return selected[0] ? selected[0].value : undefined;
  }
  set value(newValue: any) {
    this._setSelectionByValue(newValue);
    this.valueChange.emit(this.value);
  }

  @Output() readonly valueChange = new EventEmitter<any>();

  /** Selected button toggles in the group. */
  get selected(): BrnToggleDirective | BrnToggleDirective[] {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    return this.multiple ? selected : selected[0] || null;
  }

  /** Whether multiple button toggles can be selected. */
  @Input()
  get nullable(): boolean {
    return this._nullable;
  }
  set nullable(value: BooleanInput) {
    this._nullable = coerceBooleanProperty(value);
    this._markTogglesForCheck();
  }

  /** Whether multiple button toggles can be selected. */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
    this._markTogglesForCheck();
  }
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._markTogglesForCheck();
  }

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = new EventEmitter<BrnButtonToggleChange>();

  ngOnInit() {
    this._selectionModel = new SelectionModel<BrnToggleDirective>(this.multiple, undefined, false);
  }

  ngAfterContentInit() {
    if (!this._selectionModel) return;
    this._selectionModel.select(...(this._buttonToggles ?? []).filter((toggle) => toggle.isOn()));
  }

  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _emitChangeEvent(toggle: BrnToggleDirective): void {
    const event = new BrnButtonToggleChange(toggle, this.value);
    this._rawValue = event.value;
    this._controlValueAccessorChangeFn(event.value);
    this.change.emit(event);
  }

  _syncToggle(toggle: BrnToggleDirective, state: 'on' | 'off', isUserInput = false) {
    if (state === 'on') {
      if (!this.multiple) {
        this._skipNullableCheck = true;
        const togglesToBeOff = this._buttonToggles?.filter((t) => t !== toggle) ?? [];
        togglesToBeOff.filter((t) => t.toggleOff());
        this._skipNullableCheck = false;
      }
      this._selectValue(toggle.value);
    }
    if (state === 'off') {
      if (!this.multiple && toggle.value === this.value) this.value = undefined;
      if (this.multiple) {
        this.value = (this.value as any[]).filter((value) => value !== toggle.value);
      }
    }
    this._updateModelValue(toggle, isUserInput);
  }

  _canBeNullable(value: any) {
    if (this._nullable || this._skipNullableCheck) return true;
    if (this._multiple) {
      return !((this.value as any[]).length === 1 && this.value[0] === value);
    }
    return this.value !== value;
  }

  /** Updates the selection state of the toggles in the group based on a value. */
  private _setSelectionByValue(value: any | any[]) {
    this._rawValue = value;

    if (!this._buttonToggles) {
      return;
    }

    if (this.multiple && value) {
      if (!Array.isArray(value)) {
        throw Error('Value must be an array in multiple-selection mode.');
      }

      this._clearSelection();
      value.forEach((currentValue: any) => this._selectValue(currentValue));
    } else {
      this._clearSelection();
      this._selectValue(value);
    }
  }

  /** Clears the selected toggles. */
  private _clearSelection() {
    if (!this._selectionModel) return;
    this._selectionModel.clear();
    (this._buttonToggles ?? []).forEach((toggle) => toggle.toggleOff());
  }

  /** Selects a value if there's a toggle that corresponds to it. */
  private _selectValue(value: any) {
    if (!this._selectionModel) return;
    const correspondingOption = (this._buttonToggles ?? []).find((toggle) => {
      return toggle.value != null && toggle.value === value;
    });

    if (correspondingOption) {
      correspondingOption.toggleOn();
      this._selectionModel.select(correspondingOption);
    }
  }

  /** Syncs up the group's value with the model and emits the change event. */
  private _updateModelValue(toggle: BrnToggleDirective, isUserInput: boolean) {
    // Only emit the change event for user input.
    if (isUserInput) {
      this._emitChangeEvent(toggle);
    }

    // Note: we emit this one no matter whether it was a user interaction, because
    // it is used by Angular to sync up the two-way data binding.
    this.valueChange.emit(this.value);
  }

  /** Marks all the child button toggles to be checked. */
  private _markTogglesForCheck() {
    this._buttonToggles?.forEach((toggle) => toggle._markForCheck());
  }
}
