import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
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
import { ToggleGroupCanBeNullableProvider } from './toggle-group-can-be-nullable-provider';
import { map, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BrnToggleGroupComponent),
  multi: true,
};

let uniqueIdCounter = 0;

export class BrnButtonToggleChange {
  constructor(public source: BrnToggleDirective, public value: any) {}
}

@Component({
  selector: 'brn-toggle-group',
  standalone: true,
  providers: [
    BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
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
  template: ` <ng-content />`,
})
export class BrnToggleGroupComponent
  implements ControlValueAccessor, OnInit, AfterContentInit, ToggleGroupCanBeNullableProvider
{
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);
  private _vertical = false;
  private _multiple = false;
  private _nullable = false;
  private _skipNullableCheck = false;
  private _disabled = false;
  private _selectionModel?: SelectionModel<BrnToggleDirective>;

  /**
   * The method to be called in order to update ngModel.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => any = () => {};

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
    if (this._disabled) {
      return;
    }
    this._setSelectionByValue(newValue);
    this.valueChange.emit(this.value);
  }

  @Output() readonly valueChange = new EventEmitter<any>();

  /** Selected button toggles in the group. */
  get selected(): BrnToggleDirective | BrnToggleDirective[] {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    return this.multiple ? selected : selected[0] || null;
  }

  /** Whether no button toggles need to be selected. */
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
    this._buttonToggles?.forEach((toggle) => (toggle.disabled = this._disabled));
    this._markTogglesForCheck();
  }

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly change = new EventEmitter<BrnButtonToggleChange>();

  ngOnInit() {
    this._selectionModel = new SelectionModel<BrnToggleDirective>(this.multiple, undefined, false);
  }

  ngAfterContentInit() {
    if (!this._selectionModel || !this._buttonToggles) return;
    this._selectionModel.select(...this._buttonToggles.filter((toggle) => toggle.isOn()));

    merge(
      ...this._buttonToggles
        .toArray()
        .map((toggle) => toggle.toggled.asObservable().pipe(map((state) => ({ toggle: toggle, state }))))
    )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(({ state, toggle }) => {
        if (!this._selectionModel) {
          return;
        }
        this._onTouched();
        if (state === 'on') {
          if (!this.multiple) {
            this._skipNullableCheck = true;
            this._selectionModel.selected.forEach((s) => s.toggleOff());
            this._skipNullableCheck = false;
          }
          this._selectionModel.select(toggle);
        } else {
          this._selectionModel.deselect(toggle);
        }
        this._updateModelValue(toggle);
      });
  }

  writeValue(value: any) {
    this.value = value;
    this._cdr.markForCheck();
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

  _canBeNullable(value: any) {
    if (this._nullable || this._skipNullableCheck) return true;
    if (this._multiple) {
      return !((this.value as any[]).length === 1 && this.value[0] === value);
    }
    return this.value !== value;
  }

  /** Updates the selection state of the toggles in the group based on a value. */
  private _setSelectionByValue(value: any | any[]) {
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
    }
  }

  private _updateModelValue(toggle: BrnToggleDirective) {
    const value = this.value;
    const event = new BrnButtonToggleChange(toggle, value);
    this._controlValueAccessorChangeFn(value);
    this.change.emit(event);
    this.valueChange.emit(value);
  }

  /** Marks all the child button toggles to be checked. */
  private _markTogglesForCheck() {
    this._buttonToggles?.forEach((toggle) => toggle._markForCheck());
  }
}
