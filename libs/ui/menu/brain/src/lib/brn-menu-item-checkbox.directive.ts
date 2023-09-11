import { Directive, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { BooleanInput } from '@angular/cdk/coercion';

@Directive({
  selector: '[brnMenuItemCheckbox]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
      // eslint-disable-next-line @angular-eslint/no-outputs-metadata-property
      outputs:
        // eslint-disable-next-line @angular-eslint/no-output-rename
        ['cdkMenuItemTriggered: triggered'],
    },
  ],
})
export class BrnMenuItemCheckboxDirective {
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
