import { NgModule } from '@angular/core';

import { HlmSheetCloseDirective } from './lib/hlm-sheet-close.directive';
import { HlmSheetContentDirective } from './lib/hlm-sheet-content.directive';
import { HlmSheetDescriptionDirective } from './lib/hlm-sheet-description.directive';
import { HlmSheetFooterComponent } from './lib/hlm-sheet-footer.component';
import { HlmSheetOverlayDirective } from './lib/hlm-sheet-overlay.directive';
import { HlmSheetTitleDirective } from './lib/hlm-sheet-title.directive';

export * from './lib/hlm-sheet-close.directive';
export * from './lib/hlm-sheet-content.directive';
export * from './lib/hlm-sheet-description.directive';
export * from './lib/hlm-sheet-footer.component';
export * from './lib/hlm-sheet-header.component';
export * from './lib/hlm-sheet-overlay.directive';
export * from './lib/hlm-sheet-title.directive';

export const HlmSheetImports = [
	HlmSheetCloseDirective,
	HlmSheetContentDirective,
	HlmSheetDescriptionDirective,
	HlmSheetFooterComponent,
	HlmSheetOverlayDirective,
	HlmSheetTitleDirective,
] as const;

@NgModule({
	imports: [...HlmSheetImports],
	exports: [...HlmSheetImports],
})
export class HlmSheetModule {}
