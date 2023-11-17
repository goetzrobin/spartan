import { Directive } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {}
