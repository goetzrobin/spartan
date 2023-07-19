import { Directive, inject, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui/core/helm';
import { ClassValue } from 'clsx';
import { SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui/core/brain';

@Directive({
  selector: '[hlmSheetOverlay],brn-sheet-overlay[hlm]',
  standalone: true,
})
export class HlmSheetOverlayDirective {
  private _host = inject(SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN, { optional: true, host: true });
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
