import { Directive } from '@angular/core';
import { BrnDialogCloseDirective } from '@spartan-ng/ui-dialog-brain';

@Directive({
	selector: 'button[brnPopoverClose]',
	standalone: true,
})
export class BrnPopoverCloseDirective extends BrnDialogCloseDirective {}
