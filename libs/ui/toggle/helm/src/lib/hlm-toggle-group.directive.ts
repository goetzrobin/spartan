import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'brn-toggle-group[hlm],[hlmToggleGroup]',
  standalone: true,
})
export class HlmToggleGroupDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(
      'inline-flex items-center rounded-md [&>[hlm][brnToggle][variant="outline"]]:-mx-[0.5px] [&>[hlm][brnToggle]]:rounded-none focus:[&>[hlm][brnToggle]]:z-10 first-of-type:[&>[hlm][brnToggle]]:rounded-l-md last-of-type:[&>[hlm][brnToggle]]:rounded-r-md',
      this._inputs
    );
  }
}
