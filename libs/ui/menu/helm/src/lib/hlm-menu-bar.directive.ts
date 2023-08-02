import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlm][brnMenuBar]',
  standalone: true,
})
export class HlmMenuBarDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('border-border flex h-10 items-center space-x-1 rounded-md border bg-background p-1', this._inputs);
  }
}
