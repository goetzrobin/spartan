import { NgModule } from '@angular/core';
import { BrnCellDefDirective, BrnCellDirective } from './lib/brn-cell-def.directive';
import { BrnColumnDefDirective } from './lib/brn-column-def.component';
import { BrnFooterDefDirective } from './lib/brn-footer-def.directive';
import { BrnHeaderCellDefDirective, BrnHeaderCellDirective } from './lib/brn-header-def.directive';
import { BrnPaginatorDirective } from './lib/brn-paginator.directive';
import {
	BrnFooterRowComponent,
	BrnFooterRowDefDirective,
	BrnHeaderRowComponent,
	BrnHeaderRowDefDirective,
	BrnNoDataRowDirective,
	BrnRowComponent,
	BrnRowDefDirective,
} from './lib/brn-row-def.component';
import { BrnTableComponent } from './lib/brn-table.component';

export { BrnCellDefDirective, BrnCellDirective } from './lib/brn-cell-def.directive';
export { BrnColumnDefDirective } from './lib/brn-column-def.component';
export { useBrnColumnManager } from './lib/brn-column-manager';
export { BrnFooterDefDirective } from './lib/brn-footer-def.directive';
export { BrnHeaderCellDefDirective, BrnHeaderCellDirective } from './lib/brn-header-def.directive';
export { BrnPaginatorDirective, PaginatorContext, PaginatorState } from './lib/brn-paginator.directive';
export {
	BrnFooterRowComponent,
	BrnFooterRowDefDirective,
	BrnHeaderRowComponent,
	BrnHeaderRowDefDirective,
	BrnNoDataRowDirective,
	BrnRowComponent,
	BrnRowDefDirective,
} from './lib/brn-row-def.component';
export {
	BRN_TABLE_TEMPLATE,
	BrnTableComponent,
	BrnTableDataSourceInput,
	applyTableProviders,
} from './lib/brn-table.component';

export const BrnTableImports = [
	BrnTableComponent,
	BrnColumnDefDirective,

	BrnHeaderRowComponent,
	BrnHeaderCellDirective,
	BrnHeaderCellDefDirective,
	BrnHeaderRowDefDirective,

	BrnRowComponent,
	BrnRowDefDirective,

	BrnCellDirective,
	BrnCellDefDirective,

	BrnFooterRowComponent,
	BrnFooterDefDirective,
	BrnFooterRowDefDirective,

	BrnPaginatorDirective,
	BrnNoDataRowDirective,
] as const;

@NgModule({
	imports: [...BrnTableImports],
	exports: [...BrnTableImports],
})
export class BrnTableModule {}
