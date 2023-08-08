import {
  ChangeDetectorRef,
  computed,
  Directive,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ToggleSyncable } from './toggle-syncable';
import { ToggleGroupCanBeNullableProvider } from './toggle-group-can-be-nullable-provider';

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
  private _cdr = inject(ChangeDetectorRef);
  private _toggleSyncable = inject(ToggleSyncable, { optional: true });
  private _tgCanBeNullableProvider = inject(ToggleGroupCanBeNullableProvider, { optional: true });

  private _disabled = signal<true | undefined>(undefined);
  private _state = signal<'on' | 'off'>('off');

  state = this._state.asReadonly();
  toggleDisabled = this._disabled.asReadonly();
  isOn = computed(() => this.state() === 'on');

  @Input()
  value: any;

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(value) ? true : undefined);
  }

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
  toggled = new EventEmitter<'on' | 'off'>();

  constructor() {
    effect(
      () => {
        const state = this.state();
        this._toggleSyncable?._syncToggle(this, state);
        this.toggled.emit(state);
      },
      { allowSignalWrites: true }
    );
  }

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
  }

  toggleOn() {
    this._state.set('on');
  }

  public _markForCheck() {
    this._cdr.markForCheck();
  }
}
