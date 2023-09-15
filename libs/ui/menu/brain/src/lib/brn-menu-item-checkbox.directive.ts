import { Directive, HostBinding, inject, Input, Output } from '@angular/core';
import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[brnMenuItemCheckbox]',
  standalone: true,
  hostDirectives: [CdkMenuItemCheckbox],
})
export class BrnMenuItemCheckboxDirective {
  private readonly _cdkMenuItem = inject(CdkMenuItemCheckbox, { host: true });
  @HostBinding('class.checked')
  private _checked = this._cdkMenuItem.checked;
  get checked() {
    return this._checked;
  }
  @Input()
  set checked(value: BooleanInput) {
    this._cdkMenuItem.checked = value;
    this._checked = this._cdkMenuItem.checked;
  }
  get disabled() {
    return this._cdkMenuItem.disabled;
  }
  @Input()
  set disabled(value: BooleanInput) {
    this._cdkMenuItem.disabled = value;
  }
  @Output()
  triggered = this._cdkMenuItem.triggered;
}
