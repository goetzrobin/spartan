import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmToaster], brn-toaster[hlm]',
	standalone: true,
})
export class HlmToasterDirective {}
