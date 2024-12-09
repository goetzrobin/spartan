import { Directive } from '@angular/core';
import { BrnDialogDescriptionDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogDescription]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogDescriptionDirective extends BrnDialogDescriptionDirective {}
