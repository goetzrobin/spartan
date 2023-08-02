import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmAccordionTrigger],brn-accordion-trigger[hlm]',
  standalone: true,
  host: {
    '[style.--tw-ring-offset-shadow]': '"0 0 #000"',
  },
})
export class HlmAccordionTriggerDirective {
  private _host = injectCustomClassSettable({ optional: true });
  @HostBinding('class')
  private _class = !this._host ? this.generateClass() : '';
  private _inputs: ClassValue = '';

  constructor() {
    this._host?.setClassToCustomElement(this.generateClass());
  }

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    if (this._host) {
      this._host?.setClassToCustomElement(this._class);
    } else {
      this._class = this.generateClass();
    }
  }

  generateClass() {
    return hlm(
      'w-full focus-visible:outline-none text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-1 items-center justify-between py-4 px-0.5 font-medium underline-offset-4 hover:underline [&[data-state=open]>hlm-accordion-icon]:rotate-180',
      this._inputs
    );
  }
}
