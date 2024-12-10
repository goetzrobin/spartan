import { CdkFooterCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnFooterDef]',
	exportAs: 'brnFooterDef',
})
export class BrnFooterDefDirective extends CdkFooterCellDef {
	public override template: TemplateRef<unknown>;

	constructor() {
		const template = inject<TemplateRef<unknown>>(TemplateRef);

		super(template);
		this.template = template;
	}
}
