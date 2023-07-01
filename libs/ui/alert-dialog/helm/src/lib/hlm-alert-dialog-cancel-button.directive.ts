import { Directive, inject } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Directive({
  selector: 'button[hlmAlertDialogCancel]',
  standalone: true,
  hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogCancelButtonDirective {
  private _hlmBtn = inject(HlmButtonDirective, { host: true });
  constructor() {
    this._hlmBtn.variant = 'outline';
  }
}
