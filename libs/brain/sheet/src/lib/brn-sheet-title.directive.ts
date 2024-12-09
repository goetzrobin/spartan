import { Directive } from '@angular/core';
import { BrnDialogTitleDirective } from '@spartan-ng/brain/dialog';

@Directive({
	selector: '[brnSheetTitle]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnSheetTitleDirective extends BrnDialogTitleDirective {}
