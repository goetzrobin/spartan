import { Directive } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Directive({
  selector: 'button[hlmAlertDialogAction]',
  standalone: true,
  hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {}
