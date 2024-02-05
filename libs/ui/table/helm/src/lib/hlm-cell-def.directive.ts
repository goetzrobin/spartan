import { CdkCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';
import { BrnCellDefDirective, BrnCellDirective } from '@spartan-ng/ui-table-brain';

@Directive({
	standalone: true,
	selector: '[hlmCellDef]',
	providers: [{ provide: CdkCellDef, useExisting: HlmCellDefDirective }],
})
export class HlmCellDefDirective extends BrnCellDefDirective {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

/** Cell template container that adds the right classes and role. */
@Directive({
	selector: 'hlm-td, td[hlmCell]',
	host: {
		class: 'flex flex-none p-4 items-center [&:has([role=checkbox])]:pr-0',
		style: 'word-wrap: break-word; min-height: inherit;',
	},
	standalone: true,
})
export class HlmCellDirective extends BrnCellDirective {}
