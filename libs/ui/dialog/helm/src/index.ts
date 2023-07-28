import { NgModule } from '@angular/core';

import { HlmDialogCloseDirective } from './lib/hlm-dialog-close.directive';
import { HlmDialogContentDirective } from './lib/hlm-dialog-content.directive';
import { HlmDialogDescriptionDirective } from './lib/hlm-dialog-description.directive';
import { HlmDialogFooterComponent } from './lib/hlm-dialog-footer.component';
import { HlmDialogHeaderComponent } from './lib/hlm-dialog-header.component';
import { HlmDialogOverlayDirective } from './lib/hlm-dialog-overlay.directive';
import { HlmDialogTitleDirective } from './lib/hlm-dialog-title.directive';

export * from './lib/hlm-dialog-close.directive';
export * from './lib/hlm-dialog-content.directive';
export * from './lib/hlm-dialog-description.directive';
export * from './lib/hlm-dialog-footer.component';
export * from './lib/hlm-dialog-header.component';
export * from './lib/hlm-dialog-overlay.directive';
export * from './lib/hlm-dialog-title.directive';

export const HlmDialogImports = [
  HlmDialogCloseDirective,
  HlmDialogContentDirective,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogOverlayDirective,
  HlmDialogTitleDirective,
] as const;

@NgModule({
  imports: [...HlmDialogImports],
  exports: [...HlmDialogImports],
})
export class HlmDialogModule {}
