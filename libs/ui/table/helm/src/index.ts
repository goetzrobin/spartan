import { NgModule } from '@angular/core';
import { HlmCaptionComponent } from './lib/hlm-caption.component';
import { HlmCellDefDirective, HlmCellDirective } from './lib/hlm-cell-def.directive';
import { HlmColumnDefDirective } from './lib/hlm-column-def.directive';
import { HlmFooterDefDirective } from './lib/hlm-footer-def.directive';
import { HlmHeaderCellDefDirective, HlmHeaderCellDirective } from './lib/hlm-header-def.directive';
import {
	HlmFooterRowComponent,
	HlmFooterRowDefDirective,
	HlmHeaderRowComponent,
	HlmHeaderRowDefDirective,
	HlmNoDataRowDirective,
	HlmRowComponent,
	HlmRowDefDirective,
} from './lib/hlm-row-def.component';
import { HlmTableComponent } from './lib/hlm-table.component';

export { HlmCaptionComponent } from './lib/hlm-caption.component';
export { HlmCellDefDirective, HlmCellDirective } from './lib/hlm-cell-def.directive';
export { HlmColumnDefDirective } from './lib/hlm-column-def.directive';
export { HlmFooterDefDirective } from './lib/hlm-footer-def.directive';
export { HlmHeaderCellDefDirective, HlmHeaderCellDirective } from './lib/hlm-header-def.directive';
export { HlmTableComponent } from './lib/hlm-table.component';

export const HlmTableImports = [
	HlmTableComponent,
	HlmCaptionComponent,
	HlmCellDefDirective,
	HlmCellDirective,
	HlmHeaderRowComponent,
	HlmHeaderRowDefDirective,
	HlmHeaderCellDirective,
	HlmHeaderCellDefDirective,
	HlmFooterDefDirective,
	HlmFooterRowComponent,
	HlmFooterRowDefDirective,
	HlmColumnDefDirective,
	HlmRowDefDirective,
	HlmRowComponent,
	HlmNoDataRowDirective,
] as const;

@NgModule({
	imports: [...HlmTableImports],
	exports: [...HlmTableImports],
})
export class HlmTableModule {}
