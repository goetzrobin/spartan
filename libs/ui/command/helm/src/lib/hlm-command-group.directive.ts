import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'brn-cmd-group[hlm],cmdk-group[hlm]',
  standalone: true,
})
export class HlmCommandGroupDirective {
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
      'block [&[cmdk-hidden="true"]]:hidden\n' +
        '[&_.cmdk-group-label]:px-2 [&_.cmdk-group-label]:py-1.5 [&_.cmdk-group-label]:text-xs [&_.cmdk-group-label]:font-medium [&_.cmdk-group-label]:text-muted-foreground\n' +
        '[&_.cmdk-group-content]:flex [&_.cmdk-group-content]:flex-col [&_.cmdk-group-content]:flex-col overflow-hidden p-1 text-foreground',
      this._inputs
    );
  }
}
