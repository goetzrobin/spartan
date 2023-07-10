import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { CdkMenuItem } from '@angular/cdk/menu';
import { BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[brnMenuItem]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
})
export class BrnMenuItemDirective {
  private _cdkMenuItem = inject(CdkMenuItem, { host: true });
  @Input()
  set disabled(value: BooleanInput) {
    this._cdkMenuItem.disabled = value;
  }
  @Output()
  triggered = new EventEmitter<void>();
}
