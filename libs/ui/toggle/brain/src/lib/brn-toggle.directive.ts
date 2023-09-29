import { ChangeDetectorRef, computed, Directive, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ToggleGroupCanBeNullableProvider } from './toggle-group-can-be-nullable-provider';

let uniqueId = 0;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'button[hlmToggle], button[brnToggle]',
  standalone: true,
  host: {
    '[attr.disabled]': 'toggleDisabled()',
    '[attr.data-disabled]': 'toggleDisabled()',
    '[attr.data-state]': 'state()',
    '[attr.aria-pressed]': 'isOn()',
    '(click)': 'toggle()',
  },
})
export class BrnToggleDirective {
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _tgCanBeNullableProvider = inject(ToggleGroupCanBeNullableProvider, { optional: true });

  private readonly _disabled = signal<true | undefined>(undefined);
  private readonly _state = signal<'on' | 'off'>('off', { equal: (a, b) => a === b });

  public readonly state = this._state.asReadonly();
  public readonly toggleDisabled = this._disabled.asReadonly();
  public readonly isOn = computed(() => this.state() === 'on');

  @Input()
  public id = 'brn-toggle-' + uniqueId++;

  @Input()
  public value: any;

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(value) ? true : undefined);
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('state')
  set setState(value: 'on' | 'off') {
    this._state.set(value);
  }

  private _disableToggleClick = false;
  @Input()
  set disableToggleClick(value: BooleanInput) {
    this._disableToggleClick = coerceBooleanProperty(value);
  }

  @Output()
  public readonly toggled = new EventEmitter<'on' | 'off'>();

  toggle() {
    if (this._disableToggleClick) return;
    if (this._state() === 'on') {
      this.toggleOff();
    } else {
      this.toggleOn();
    }
  }

  toggleOff() {
    if (this._tgCanBeNullableProvider && !this._tgCanBeNullableProvider._canBeNullable(this.value)) return;
    this._state.set('off');
    this.toggled.emit('off');
  }

  toggleOn() {
    this._state.set('on');
    this.toggled.emit('on');
  }

  public _markForCheck() {
    this._cdr.markForCheck();
  }
}
