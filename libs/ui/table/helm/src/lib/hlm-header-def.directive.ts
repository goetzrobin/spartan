import { CdkHeaderCell, CdkHeaderCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[hlmHeaderCellDef]',
	providers: [{ provide: CdkHeaderCellDef, useExisting: HlmHeaderCellDefDirective }],
})
export class HlmHeaderCellDefDirective extends CdkHeaderCellDef {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

/** Header cell template container that adds the right classes and role. */
@Directive({
	selector: 'hlm-th, th[hlmHeaderCell]',
	host: {
		class:
			'flex flex-none h-12 px-4 text-sm items-center font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
		style: 'word-wrap: break-word; min-height: inherit;',
		role: 'columnheader',
	},
	standalone: true,
})
export class HlmHeaderCellDirective extends CdkHeaderCell {}
