import { ChangeDetectorRef, computed, Directive, effect, inject, Input, signal } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ToggleSyncable } from './toggle-syncable';

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

  constructor() {
    effect(
      () => {
        this._toggleSyncable?._syncToggle(this, this.state(), true);
      },
      { allowSignalWrites: true }
    );
  }

  toggle() {
    this._state.set(this._state() === 'on' ? 'off' : 'on');
  }
  toggleOff() {
    this._state.set('off');
  }
  toggleOn() {
    this._state.set('on');
  }
  public _markForCheck() {
    this._cdr.markForCheck();
  }
}
