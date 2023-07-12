import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';

@Directive({
  selector: 'cmdk-list[hlm],brn-cmd-list[hlm]',
  standalone: true,
})
export class HlmCommandListDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('max-h-[300px] overflow-y-auto overflow-x-hidden', this._inputs);
  }
}
