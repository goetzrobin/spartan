import { CdkHeaderCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnHeaderCellDefDirective, BrnHeaderCellDirective } from '@spartan-ng/ui-table-brain';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';
import { HlmTableComponent } from './hlm-table.component';

@Directive({
	standalone: true,
	selector: '[hlmHeaderCellDef]',
	providers: [{ provide: CdkHeaderCellDef, useExisting: HlmHeaderCellDefDirective }],
})
export class HlmHeaderCellDefDirective extends BrnHeaderCellDefDirective {
	constructor(public override template: TemplateRef<unknown>) {
		super(template);
	}
}

export const headerVariants = cva('h-12 px-4 text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', {
	variants: { variant: { table: 'text-left', flex: 'flex flex-none items-center' } },
	defaultVariants: { variant: 'table' },
});

/** Header cell template container that adds the right classes and role. */
@Directive({
	selector: 'hlm-th, th[hlmHeaderCell]',
	host: {
		'[class]': '_computedClass()',
		style: 'word-wrap: break-word; min-height: inherit;',
		role: 'columnheader',
	},
	standalone: true,
})
export class HlmHeaderCellDirective extends BrnHeaderCellDirective {
	readonly tableVariant = inject(HlmTableComponent).variant;

	private readonly class = input<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm(headerVariants({ variant: this.tableVariant() }), this.class()),
	);
}
