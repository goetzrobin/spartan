import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlm][brnCmdItem],[hlm][cmdkItem]',
  standalone: true,
  host: {
    class: 'flex items-center',
  },
})
export class HlmCommandItemDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm(
      'relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none\n' +
        'aria-selected:bg-accent aria-selected:text-accent-foreground\n' +
        'hover:bg-accent/50\n' +
        'disabled:pointer-events-none disabled:opacity-50',
      this._inputs,
    );
  }
}
