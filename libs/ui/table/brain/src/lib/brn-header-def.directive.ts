import { CdkHeaderCellDef } from '@angular/cdk/table';
// biome-ignore lint/style/useImportType: <explanation>
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnHeaderDef]',
	exportAs: 'brnHeaderDef',
})
export class BrnHeaderDefDirective extends CdkHeaderCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}
