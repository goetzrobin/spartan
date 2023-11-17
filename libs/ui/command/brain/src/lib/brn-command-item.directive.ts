import { Directive, forwardRef } from '@angular/core';
import { ItemDirective } from '@ngneat/cmdk';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
	selector: '[brnCmdItem]',
	standalone: true,
	providers: [
		{
			provide: ItemDirective,
			useExisting: forwardRef(() => BrnCommandItemDirective),
		},
	],
	host: {
		tabindex: '-1',
		class: 'cmdk-item',
	},
})
export class BrnCommandItemDirective extends ItemDirective {}
