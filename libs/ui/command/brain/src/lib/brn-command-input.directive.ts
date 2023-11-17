import { Directive, forwardRef } from '@angular/core';
import { InputDirective } from '@ngneat/cmdk';

@Directive({
	selector: 'input[brnCmdInput]',
	standalone: true,
	providers: [
		{
			provide: InputDirective,
			useExisting: forwardRef(() => BrnCommandInputDirective),
		},
	],
	host: {
		class: 'cmdk-input',
	},
})
export class BrnCommandInputDirective extends InputDirective {}
