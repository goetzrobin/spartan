import {
	CdkCellOutlet,
	CdkFooterRow,
	CdkFooterRowDef,
	CdkHeaderRow,
	CdkHeaderRowDef,
	CdkNoDataRow,
	CdkRow,
	CdkRowDef,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

// We can't reuse `CDK_ROW_TEMPLATE` because it's incompatible with local compilation mode.
const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

/**
 * Header row definition for the b-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
	selector: '[hlmHeaderRowDef]',
	providers: [{ provide: CdkHeaderRowDef, useExisting: HlmHeaderRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: hlmHeaderRowDef', 'sticky: hlmHeaderRowDefSticky'],
	standalone: true,
})
export class HlmHeaderRowDefDirective extends CdkHeaderRowDef {}

/**
 * Footer row definition for the b-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
	selector: '[hlmFooterRowDef]',
	providers: [{ provide: CdkFooterRowDef, useExisting: HlmFooterRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: hlmFooterRowDef', 'sticky: hlmFooterRowDefSticky'],
	standalone: true,
})
export class HlmFooterRowDefDirective extends CdkFooterRowDef {}

/**
 * Data row definition for the b-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
	selector: '[hlmRowDef]',
	providers: [{ provide: CdkRowDef, useExisting: HlmRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: hlmRowDefColumns', 'when: hlmRowDefWhen'],
	standalone: true,
})
export class HlmRowDefDirective<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'hlm-header-row, tr[hlmHeaderRow]',
	template: ROW_TEMPLATE,
	host: {
		class:
			'flex flex box-border border-b border-border transition-colors hover:bg-neutral-100 data-[state=selected]:bg-muted',
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmHeaderRow',
	providers: [{ provide: CdkHeaderRow, useExisting: HlmHeaderRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class HlmHeaderRowComponent extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'hlm-footer-row, tr[hlmFooterRow]',
	template: ROW_TEMPLATE,
	host: {
		class:
			'flex flex box-border border-b border-border transition-colors hover:bg-neutral-100 data-[state=selected]:bg-muted',
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmFooterRow',
	providers: [{ provide: CdkFooterRow, useExisting: HlmFooterRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class HlmFooterRowComponent extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'hlm-row, tr[hlmRow]',
	template: ROW_TEMPLATE,
	host: {
		class:
			'flex min-w-[100%] w-fit border-b border-border transition-[background-color] hover:bg-neutral-100 [&:has([role=checkbox][aria-checked=true])]:bg-neutral-100',
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmRow',
	providers: [{ provide: CdkRow, useExisting: HlmRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class HlmRowComponent extends CdkRow {}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
	selector: 'ng-template[hlmNoDataRow]',
	providers: [{ provide: CdkNoDataRow, useExisting: HlmNoDataRowDirective }],
	standalone: true,
})
export class HlmNoDataRowDirective extends CdkNoDataRow {
	override _contentClassName = 'hlm-no-data-row';
}
