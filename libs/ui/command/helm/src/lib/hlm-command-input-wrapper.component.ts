import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Component({
  selector: 'hlm-cmd-input-wrapper',
  standalone: true,
  template: '<ng-content/>',
})
export class HlmCommandInputWrapperComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm(
      'flex space-x-2 items-center border-b border-border px-3 [&_hlm-icon]:h-5 [&_hlm-icon]:w-5',
      this._inputs,
    );
  }
}
