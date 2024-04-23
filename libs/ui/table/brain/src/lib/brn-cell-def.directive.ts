import { CdkCellDef } from '@angular/cdk/table';
// biome-ignore lint/style/useImportType: <explanation>
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
