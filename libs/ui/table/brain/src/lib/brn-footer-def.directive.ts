import { CdkFooterCellDef } from '@angular/cdk/table';
// biome-ignore lint/style/useImportType: <explanation>
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
