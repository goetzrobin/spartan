import { booleanAttribute, Directive, inject, Input, Output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';

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

  @Input({ transform: booleanAttribute })
  set disabled(value) {
    this._cdkMenuItem.disabled = value;
  }

  @Output()
  triggered = this._cdkMenuItem.triggered;
}
