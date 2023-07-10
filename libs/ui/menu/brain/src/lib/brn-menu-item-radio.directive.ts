import { Directive, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[brnMenuItemRadio]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
})
export class BrnMenuItemRadioDirective {
  private _cdkMenuItem = inject(CdkMenuItemCheckbox, { host: true });
  @HostBinding('class.checked')
  private _checked = this._cdkMenuItem.checked;
  @Input()
  set disabled(value: BooleanInput) {
    this._cdkMenuItem.disabled = value;
  }
  @Input()
  set checked(value: BooleanInput) {
    this._cdkMenuItem.checked = value;
    this._checked = this._cdkMenuItem.checked;
  }
  @Output()
  triggered = new EventEmitter<void>();
}
