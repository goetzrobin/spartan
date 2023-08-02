import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'brn-radio[hlm],[hlmRadio]',
  standalone: true,
})
export class HlmRadioDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('group [&.brn-radio-disabled]:text-muted-foreground flex items-center space-x-2', this._inputs);
  }
}
