import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmProgress],brn-progress[hlm]',
  standalone: true,
})
export class HlmProgressDirective {
  private _inputs: ClassValue = '';
  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }
  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm('inline-flex relative h-4 w-full overflow-hidden rounded-full bg-secondary', this._inputs);
  }
}
