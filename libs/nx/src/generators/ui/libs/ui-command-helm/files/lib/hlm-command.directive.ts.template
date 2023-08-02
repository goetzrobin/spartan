import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'cmdk-command[hlm],brn-cmd[hlm]',
  standalone: true,
})
export class HlmCommandDirective {
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
      'flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground',
      this._inputs
    );
  }
}
