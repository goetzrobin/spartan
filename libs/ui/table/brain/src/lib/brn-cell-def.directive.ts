import { CdkCellDef } from '@angular/cdk/table';
// biome-ignore lint/style/useImportType: <explanation>
import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnCellDef]',
	exportAs: 'brnCellDef',
})
export class BrnCellDefDirective extends CdkCellDef {
	override template: TemplateRef<unknown>;

	constructor() {
		const template = inject<TemplateRef<unknown>>(TemplateRef);

		super(template);
		this.template = template;
	}
}
