import { Directive, forwardRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ItemDirective } from '@ngxpert/cmdk';

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
