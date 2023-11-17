import { NgModule } from '@angular/core';

import { HlmCommandDialogCloseButtonDirective } from './lib/hlm-command-dialog-close-button.directive';
import { HlmCommandDialogDirective } from './lib/hlm-command-dialog.directive';
import { HlmCommandEmptyDirective } from './lib/hlm-command-empty.directive';
import { HlmCommandGroupDirective } from './lib/hlm-command-group.directive';
import { HlmCommandInputWrapperComponent } from './lib/hlm-command-input-wrapper.component';
import { HlmCommandInputDirective } from './lib/hlm-command-input.directive';
import { HlmCommandItemIconDirective } from './lib/hlm-command-item-icon.directive';
import { HlmCommandItemDirective } from './lib/hlm-command-item.directive';
import { HlmCommandListDirective } from './lib/hlm-command-list.directive';
import { HlmCommandSeparatorDirective } from './lib/hlm-command-separator.directive';
import { HlmCommandShortcutComponent } from './lib/hlm-command-shortcut.component';
import { HlmCommandDirective } from './lib/hlm-command.directive';

export * from './lib/hlm-command-dialog-close-button.directive';
export * from './lib/hlm-command-dialog.directive';
export * from './lib/hlm-command-empty.directive';
export * from './lib/hlm-command-group.directive';
export * from './lib/hlm-command-input-wrapper.component';
export * from './lib/hlm-command-input.directive';
export * from './lib/hlm-command-item-icon.directive';
export * from './lib/hlm-command-item.directive';
export * from './lib/hlm-command-list.directive';
export * from './lib/hlm-command-loader.directive';
export * from './lib/hlm-command-separator.directive';
export * from './lib/hlm-command-shortcut.component';
export * from './lib/hlm-command.directive';

export const HlmCommandImports = [
	HlmCommandDirective,
	HlmCommandInputDirective,
	HlmCommandItemDirective,
	HlmCommandSeparatorDirective,
	HlmCommandGroupDirective,
	HlmCommandListDirective,
	HlmCommandShortcutComponent,
	HlmCommandItemIconDirective,
	HlmCommandEmptyDirective,
	HlmCommandInputWrapperComponent,
	HlmCommandDialogCloseButtonDirective,
	HlmCommandDialogDirective,
] as const;

@NgModule({
	imports: [...HlmCommandImports],
	exports: [...HlmCommandImports],
})
export class HlmCommandModule {}
