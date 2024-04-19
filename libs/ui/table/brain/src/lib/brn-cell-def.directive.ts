import { CdkCell, CdkCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnCellDef]',
	providers: [{ provide: CdkCellDef, useExisting: BrnCellDefDirective }],
})
export class BrnCellDefDirective extends CdkCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

/** Cell template container that adds the right classes and role. */
@Directive({
	selector: 'brn-cell, td[brnCell]',
	standalone: true,
})
export class BrnCellDirective extends CdkCell {}
