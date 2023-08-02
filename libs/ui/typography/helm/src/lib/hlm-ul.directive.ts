import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export const hlmUl = 'my-6 ml-6 list-disc [&>li]:mt-2';

@Directive({
  selector: '[hlmUl]',
  standalone: true,
})
export class HlmUlDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(hlmUl, this._inputs);
  }
}
