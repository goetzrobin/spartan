import { CdkCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnCellDefDirective, BrnCellDirective } from '@spartan-ng/ui-table-brain';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';
import { HlmTableComponent } from './hlm-table.component';

export const cellVariants = cva('p-4 [&:has([role=checkbox])]:pr-0', {
	variants: { variant: { table: '', flex: 'flex flex-none items-center' } },
	defaultVariants: { variant: 'table' },
});

@Directive({
	standalone: true,
	selector: '[hlmCellDef]',
	providers: [{ provide: CdkCellDef, useExisting: HlmCellDefDirective }],
})
export class HlmCellDefDirective extends BrnCellDefDirective {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

/** Cell template container that adds the right classes and role. */
@Directive({
	selector: 'hlm-td, td[hlmCell]',
	host: {
		'[class]': '_computedClass()',
		style: 'word-wrap: break-word; min-height: inherit;',
	},
	standalone: true,
})
export class HlmCellDirective extends BrnCellDirective {
	readonly tableVariant = inject(HlmTableComponent).variant;

	private readonly class = input<ClassValue>('');
	protected readonly _computedClass = computed(() => hlm(cellVariants({ variant: this.tableVariant() }), this.class()));
}
