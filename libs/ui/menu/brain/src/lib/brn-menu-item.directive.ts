import { Directive, inject, Input, Output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';
import { BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[brnMenuItem]',
  standalone: true,
  hostDirectives: [CdkMenuItem],
})
export class BrnMenuItemDirective {
  private _cdkMenuItem = inject(CdkMenuItem, { host: true });

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
