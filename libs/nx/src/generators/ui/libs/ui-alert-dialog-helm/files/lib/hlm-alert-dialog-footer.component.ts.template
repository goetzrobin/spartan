import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-alert-dialog-footer',
  standalone: true,
  template: `<ng-content />`,
})
export class HlmAlertDialogFooterComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', this._inputs);
  }
}
