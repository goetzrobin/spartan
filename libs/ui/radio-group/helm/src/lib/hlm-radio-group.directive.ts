import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'brn-radio-group[hlm],[hlmRadioGroup]',
  standalone: true,
})
export class HlmRadioGroupDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('block', this._inputs);
  }
}
