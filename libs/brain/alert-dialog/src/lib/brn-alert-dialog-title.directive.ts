import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnAlertDialogTitle]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnAlertDialogTitleDirective extends BrnDialogTitleDirective {}
