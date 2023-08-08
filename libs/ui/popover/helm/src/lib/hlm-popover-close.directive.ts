import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmPopoverClose],[brnPopoverClose][hlm]',
  standalone: true,
})
export class HlmPopoverCloseDirective {
  @HostBinding('class')
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm(
      'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
      this._inputs
    );
  }
}
