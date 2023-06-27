import { Directive, Input, signal } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'button[hlmToggle], button[brnToggle]',
  standalone: true,
  host: {
    '[attr.disabled]': 'toggleDisabled()',
    '[attr.data-disabled]': 'toggleDisabled()',
    '[attr.data-state]': 'state()',
    '(click)': 'toggle()',
  },
})
export class BrnToggleDirective {
  private _state = signal<'on' | 'off'>('off');
  state = this._state.asReadonly();
  private _disabled = signal<true | undefined>(undefined);
  @Input()
  set disabled(value: BooleanInput) {
    this._disabled.set(coerceBooleanProperty(value) ? true : undefined);
  }
  toggleDisabled = this._disabled.asReadonly();

  public toggle() {
    this._state.set(this._state() === 'on' ? 'off' : 'on');
  }
}
