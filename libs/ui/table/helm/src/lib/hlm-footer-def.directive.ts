import { Directive, TemplateRef } from '@angular/core';
import { BrnFooterDefDirective } from '@spartan-ng/ui-table-brain';

@Directive({
	standalone: true,
	selector: '[hlmFooterDef]',
	host: {
		class: 'flex flex-1 items-center overflow-hidden',
		style: 'word-wrap: break-word; min-height: inherit;',
	},
})
export class HlmFooterDefDirective extends BrnFooterDefDirective {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}
