import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export const hlmH3 = 'scroll-m-20 text-2xl font-semibold tracking-tight';

@Directive({
  selector: '[hlmH3]',
  standalone: true,
})
export class HlmH3Directive {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(hlmH3, this._inputs);
  }
}
