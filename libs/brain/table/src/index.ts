import { NgModule } from '@angular/core';
import { BrnCellDefDirective } from './lib/brn-cell-def.directive';
import { BrnColumnDefComponent } from './lib/brn-column-def.component';
import { BrnFooterDefDirective } from './lib/brn-footer-def.directive';
import { BrnHeaderDefDirective } from './lib/brn-header-def.directive';
import { BrnPaginatorDirective } from './lib/brn-paginator.directive';
import { BrnTableComponent } from './lib/brn-table.component';

export { BrnCellDefDirective } from './lib/brn-cell-def.directive';
export { BrnColumnDefComponent } from './lib/brn-column-def.component';
export { BrnColumnManager, useBrnColumnManager } from './lib/brn-column-manager';
export { BrnFooterDefDirective } from './lib/brn-footer-def.directive';
export { BrnHeaderDefDirective } from './lib/brn-header-def.directive';
export { BrnPaginatorDirective, PaginatorContext, PaginatorState } from './lib/brn-paginator.directive';
export { BrnTableComponent } from './lib/brn-table.component';

export const BrnTableImports = [
	BrnCellDefDirective,
	BrnColumnDefComponent,
	BrnFooterDefDirective,
	BrnHeaderDefDirective,
	BrnTableComponent,
	BrnPaginatorDirective,
] as const;

@NgModule({
	imports: [...BrnTableImports],
	exports: [...BrnTableImports],
})
export class BrnTableModule {}
