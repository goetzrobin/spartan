import { NgModule } from '@angular/core';

import { CmdkModule } from '@ngneat/cmdk';
import { BrnCommandEmptyDirective } from './lib/brn-command-empty.directive';
import { BrnCommandGroupComponent } from './lib/brn-command-group.component';
import { BrnCommandInputDirective } from './lib/brn-command-input.directive';
import { BrnCommandItemDirective } from './lib/brn-command-item.directive';
import { BrnCommandListComponent } from './lib/brn-command-list.component';
import { BrnCommandLoaderDirective } from './lib/brn-command-loader.directive';
import { BrnCommandSeparatorComponent } from './lib/brn-command-separator.component';
import { BrnCommandComponent } from './lib/brn-command.component';

export * from './lib/brn-command-empty.directive';
export * from './lib/brn-command-group.component';
export * from './lib/brn-command-input.directive';
export * from './lib/brn-command-item.directive';
export * from './lib/brn-command-list.component';
export * from './lib/brn-command-loader.directive';
export * from './lib/brn-command-separator.component';
export * from './lib/brn-command.component';

export const BrnCommandImports = [
	CmdkModule,
	BrnCommandComponent,
	BrnCommandEmptyDirective,
	BrnCommandGroupComponent,
	BrnCommandInputDirective,
	BrnCommandItemDirective,
	BrnCommandListComponent,
	BrnCommandLoaderDirective,
	BrnCommandSeparatorComponent,
	BrnCommandSeparatorComponent,
] as const;

@NgModule({
	imports: [...BrnCommandImports],
	exports: [...BrnCommandImports],
})
export class BrnCommandModule {}
