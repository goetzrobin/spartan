import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: 'button[brnPopoverClose]',
	standalone: true,
})
export class BrnPopoverCloseDirective extends BrnDialogCloseDirective {}
