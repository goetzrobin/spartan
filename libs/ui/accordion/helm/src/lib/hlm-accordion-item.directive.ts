import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmAccordionItem],brn-accordion-item[hlm]',
  standalone: true,
})
export class HlmAccordionItemDirective {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('flex flex-1 flex-col border-b border-border', this._inputs);
  }
}
