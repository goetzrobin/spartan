import { CdkCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnCellDef]',
	exportAs: 'brnCellDef',
})
export class BrnCellDefDirective extends CdkCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}
