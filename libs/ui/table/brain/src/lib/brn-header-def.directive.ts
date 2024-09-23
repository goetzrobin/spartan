import { CdkHeaderCellDef } from '@angular/cdk/table';
// biome-ignore lint/style/useImportType: <explanation>
import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnHeaderDef]',
	exportAs: 'brnHeaderDef',
})
export class BrnHeaderDefDirective extends CdkHeaderCellDef {
	override template: TemplateRef<unknown>;

	constructor() {
		const template = inject<TemplateRef<unknown>>(TemplateRef);

		super(template);
		this.template = template;
	}
}
