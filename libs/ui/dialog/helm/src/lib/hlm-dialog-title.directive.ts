import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core-helm';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmDialogTitle],[brnDialogTitle][hlm]',
  standalone: true,
})
export class HlmDialogTitleDirective {
  @HostBinding('class')
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm('text-lg font-semibold leading-none tracking-tight', this._inputs);
  }
}
