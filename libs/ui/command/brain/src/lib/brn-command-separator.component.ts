import { Component, forwardRef } from '@angular/core';
import { SeparatorComponent } from '@ngneat/cmdk';

@Component({
	selector: 'brn-cmd-separator',
	standalone: true,
	template: '<hr>',
	providers: [
		{
			provide: SeparatorComponent,
			useExisting: forwardRef(() => BrnCommandSeparatorComponent),
		},
	],
	host: {
		class: 'cmdk-separator',
	},
})
export class BrnCommandSeparatorComponent extends SeparatorComponent {}
