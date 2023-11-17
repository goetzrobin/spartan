import { NgModule } from '@angular/core';

import { BrnSheetCloseDirective } from './lib/brn-sheet-close.directive';
import { BrnSheetContentDirective } from './lib/brn-sheet-content.directive';
import { BrnSheetDescriptionDirective } from './lib/brn-sheet-description.directive';
import { BrnSheetOverlayComponent } from './lib/brn-sheet-overlay.component';
import { BrnSheetTitleDirective } from './lib/brn-sheet-title.directive';
import { BrnSheetTriggerDirective } from './lib/brn-sheet-trigger.directive';
import { BrnSheetComponent } from './lib/brn-sheet.component';

export * from './lib/brn-sheet-close.directive';
export * from './lib/brn-sheet-content.directive';
export * from './lib/brn-sheet-description.directive';
export * from './lib/brn-sheet-overlay.component';
export * from './lib/brn-sheet-title.directive';
export * from './lib/brn-sheet-trigger.directive';
export * from './lib/brn-sheet.component';

export const BrnSheetImports = [
	BrnSheetComponent,
	BrnSheetOverlayComponent,
	BrnSheetTriggerDirective,
	BrnSheetCloseDirective,
	BrnSheetContentDirective,
	BrnSheetTitleDirective,
	BrnSheetDescriptionDirective,
] as const;

@NgModule({
	imports: [...BrnSheetImports],
	exports: [...BrnSheetImports],
})
export class BrnSheetModule {}
