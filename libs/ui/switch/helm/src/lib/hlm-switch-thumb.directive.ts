import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@ng-spartan/ui/core/helm';

@Directive({
  selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
  standalone: true
})
export class HlmSwitchThumbDirective {
  private _inputs: ClassValue = '';
  @HostBinding('class')
  private _class = this.generateClass();

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  private generateClass() {
    return hlm(
      'block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform group-data-[state=checked]:translate-x-5 group-data-[state=unchecked]:translate-x-0',
      this._inputs
    );
  }
}
