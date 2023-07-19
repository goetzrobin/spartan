import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui/core/helm';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmSheetTitle],[brnSheetTitle][hlm]',
  standalone: true,
})
export class HlmSheetTitleDirective {
  @HostBinding('class')
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm('text-lg font-semibold', this._inputs);
  }
}
