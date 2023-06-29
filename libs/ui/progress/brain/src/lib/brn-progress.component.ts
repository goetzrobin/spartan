import { Component, computed, Input, signal } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'brn-progress',
  standalone: true,
  template: '<ng-content/>',
  host: {
    role: 'progressbar',
    '[attr.aria-valuemax]': '_max()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuenow]': 'isNumber() ? _value() : undefined',
    '[attr.aria-valuetext]': '_value() ? getValueLabel(_value(),_max()) : undefined',
    '[attr.data-state]': 'progressState()',
    '[attr.data-value]': '_value() ?? undefined',
    '[attr.data-max]': '_max()',
  },
})
export class BrnProgressComponent {
  protected readonly _value = signal<number | null | undefined>(undefined);
  public readonly $value = this._value.asReadonly();
  @Input()
  set value(newValue: NumberInput) {
    if (newValue === undefined || newValue === null || newValue === 'null' || newValue === 'undefined') {
      this._value.set(null);
      return;
    }

    newValue = coerceNumberProperty(newValue);
    if (newValue > this._max() || newValue < 0) {
      throw Error('Value must be 0 or greater and less or equal to max');
    }
    this._value.set(newValue);
  }

  protected readonly _max = signal(100);
  public readonly $max = this._max.asReadonly();
  @Input()
  set max(value: NumberInput) {
    const newValue = coerceNumberProperty(value);
    if (newValue < 0) {
      throw Error('max must be greater than 0');
    }
    this._max.set(newValue);
  }
  @Input()
  getValueLabel: (value: number, max: number) => string = (value, max) => `${Math.round((value / max) * 100)}%`;

  isNumber() {
    return typeof this._value() === 'number';
  }

  progressState = computed(() => {
    return this._value() == null || this._value() === undefined
      ? 'indeterminate'
      : this._value() === this._max()
      ? 'complete'
      : 'loading';
  });
}
