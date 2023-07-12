import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';

@Directive({
  selector: '[hlmCmdEmpty]',
  standalone: true,
})
export class HlmCommandEmptyDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('py-6 text-center text-sm', this._inputs);
  }
}
