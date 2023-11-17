import { Directive, forwardRef } from '@angular/core';
import { LoaderDirective } from '@ngneat/cmdk';

@Directive({
	selector: '[brnCmdLoader]',
	standalone: true,
	providers: [
		{
			provide: LoaderDirective,
			useExisting: forwardRef(() => BrnCommandLoaderDirective),
		},
	],
	host: {
		class: 'cmdk-loader',
	},
})
export class BrnCommandLoaderDirective extends LoaderDirective {}
