import { CdkHeaderCell, CdkHeaderCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnHeaderCellDef]',
	providers: [{ provide: CdkHeaderCellDef, useExisting: BrnHeaderCellDefDirective }],
})
export class BrnHeaderCellDefDirective extends CdkHeaderCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

/** Header cell template container that adds the right classes and role. */
@Directive({
	selector: 'brn-header-cell, th[brnHeaderCell]',
	host: {
		role: 'columnheader',
	},
	standalone: true,
})
export class BrnHeaderCellDirective extends CdkHeaderCell {}
