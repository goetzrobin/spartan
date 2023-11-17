import { NgModule } from '@angular/core';

import { BrnAlertDialogCloseDirective } from './lib/brn-alert-dialog-close.directive';
import { BrnAlertDialogContentDirective } from './lib/brn-alert-dialog-content.directive';
import { BrnAlertDialogDescriptionDirective } from './lib/brn-alert-dialog-description.directive';
import { BrnAlertDialogOverlayComponent } from './lib/brn-alert-dialog-overlay.component';
import { BrnAlertDialogTitleDirective } from './lib/brn-alert-dialog-title.directive';
import { BrnAlertDialogTriggerDirective } from './lib/brn-alert-dialog-trigger.directive';
import { BrnAlertDialogComponent } from './lib/brn-alert-dialog.component';

export * from './lib/brn-alert-dialog-close.directive';
export * from './lib/brn-alert-dialog-content.directive';
export * from './lib/brn-alert-dialog-description.directive';
export * from './lib/brn-alert-dialog-overlay.component';
export * from './lib/brn-alert-dialog-title.directive';
export * from './lib/brn-alert-dialog-trigger.directive';
export * from './lib/brn-alert-dialog.component';

export const BrnAlertDialogImports = [
	BrnAlertDialogComponent,
	BrnAlertDialogOverlayComponent,
	BrnAlertDialogTriggerDirective,
	BrnAlertDialogCloseDirective,
	BrnAlertDialogContentDirective,
	BrnAlertDialogTitleDirective,
	BrnAlertDialogDescriptionDirective,
] as const;

@NgModule({
	imports: [...BrnAlertDialogImports],
	exports: [...BrnAlertDialogImports],
})
export class BrnAlertDialogModule {}
