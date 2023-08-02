import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-alert-dialog-header',
  standalone: true,
  template: `<ng-content />`,
})
export class HlmAlertDialogHeaderComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('flex flex-col space-y-2 text-center sm:text-left', this._inputs);
  }
}
