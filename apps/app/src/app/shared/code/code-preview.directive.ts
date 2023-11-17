import { Directive } from '@angular/core';

@Directive({
	selector: '[spartanCodePreview]',
	standalone: true,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CodePreviewDirective {}
