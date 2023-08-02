import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export const hlmH1 = 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';

@Directive({
  selector: '[hlmH1]',
  standalone: true,
})
export class HlmH1Directive {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(hlmH1, this._inputs);
  }
}
