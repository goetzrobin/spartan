import { BrnDialogComponent } from './lib/brn-dialog.component';
import { BrnDialogOverlayComponent } from './lib/brn-dialog-overlay.component';
import { BrnDialogTriggerDirective } from './lib/brn-dialog-trigger.directive';
import { BrnDialogCloseDirective } from './lib/brn-dialog-close.directive';
import { BrnDialogContentDirective } from './lib/brn-dialog-content.directive';
import { BrnDialogTitleDirective } from './lib/brn-dialog-title.directive';
import { BrnDialogDescriptionDirective } from './lib/brn-dialog-description.directive';

export * from './lib/brn-dialog.component';
export * from './lib/brn-dialog-overlay.component';
export * from './lib/brn-dialog-trigger.directive';
export * from './lib/brn-dialog-close.directive';
export * from './lib/brn-dialog-content.directive';
export * from './lib/brn-dialog-title.directive';
export * from './lib/brn-dialog-description.directive';

export * from './lib/brn-dialog.service';

export const BrnDialogImports = [
  BrnDialogComponent,
  BrnDialogOverlayComponent,
  BrnDialogTriggerDirective,
  BrnDialogCloseDirective,
  BrnDialogContentDirective,
  BrnDialogTitleDirective,
  BrnDialogDescriptionDirective,
];
