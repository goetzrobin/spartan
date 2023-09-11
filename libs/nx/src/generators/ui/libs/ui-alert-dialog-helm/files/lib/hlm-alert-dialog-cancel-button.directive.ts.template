import { Directive, HostBinding, inject, Input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: 'button[hlmAlertDialogCancel]',
  standalone: true,
  hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogCancelButtonDirective {
  private _hlmBtn = inject(HlmButtonDirective, { host: true });
  @HostBinding('class')
  _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm('mt-2 sm:mt-0', this._inputs);
  }
  constructor() {
    this._hlmBtn.variant = 'outline';
  }
}
