import { Directive, Input } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmDialogOverlay],brn-dialog-overlay[hlm]',
  standalone: true,
})
export class HlmDialogOverlayDirective {
  private _host = injectCustomClassSettable({ optional: true, host: true });
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  constructor() {
    this._host?.setClassToCustomElement(this._class);
  }

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
    this._host?.setClassToCustomElement(this._class);
  }

  private generateClasses() {
    return hlm(
      'bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      this._inputs
    );
  }
}
