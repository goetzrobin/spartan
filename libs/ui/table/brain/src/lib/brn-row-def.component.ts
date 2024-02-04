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
 * Header row definition for the brn-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
	selector: '[brnHeaderRowDef]',
	providers: [{ provide: CdkHeaderRowDef, useExisting: BrnHeaderRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: brnHeaderRowDef', 'sticky: brnHeaderRowDefSticky'],
	standalone: true,
})
export class BrnHeaderRowDefDirective extends CdkHeaderRowDef {}

/**
 * Footer row definition for the brn-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
	selector: '[brnFooterRowDef]',
	providers: [{ provide: CdkFooterRowDef, useExisting: BrnFooterRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: brnFooterRowDef', 'sticky: brnFooterRowDefSticky'],
	standalone: true,
})
export class BrnFooterRowDefDirective extends CdkFooterRowDef {}

/**
 * Data row definition for the brn-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
	selector: '[brnRowDef]',
	providers: [{ provide: CdkRowDef, useExisting: BrnRowDefDirective }],
	// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
	inputs: ['columns: brnRowDefColumns', 'when: brnRowDefWhen'],
	standalone: true,
})
export class BrnRowDefDirective<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'brn-header-row, tr[brn-header-row]',
	template: ROW_TEMPLATE,
	host: {
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnHeaderRow',
	providers: [{ provide: CdkHeaderRow, useExisting: BrnHeaderRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class BrnHeaderRowComponent extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'brn-footer-row, tr[brn-footer-row]',
	template: ROW_TEMPLATE,
	host: {
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// tslint:disable-next-line:validate-decorators
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnFooterRow',
	providers: [{ provide: CdkFooterRow, useExisting: BrnFooterRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class BrnFooterRowComponent extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
	selector: 'brn-row, tr[brn-row]',
	template: ROW_TEMPLATE,
	host: {
		role: 'row',
	},
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// tslint:disable-next-line:validate-decorators
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnRow',
	providers: [{ provide: CdkRow, useExisting: BrnRowComponent }],
	standalone: true,
	imports: [CdkCellOutlet],
})
export class BrnRowComponent extends CdkRow {}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
	selector: 'ng-template[brnNoDataRow]',
	providers: [{ provide: CdkNoDataRow, useExisting: BrnNoDataRowDirective }],
	standalone: true,
})
export class BrnNoDataRowDirective extends CdkNoDataRow {
	override _contentClassName = 'brn-no-data-row';
}
