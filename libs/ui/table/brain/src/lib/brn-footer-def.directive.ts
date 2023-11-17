import { CdkFooterCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnFooterDef]',
	exportAs: 'brnFooterDef',
})
export class BrnFooterDefDirective extends CdkFooterCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}
