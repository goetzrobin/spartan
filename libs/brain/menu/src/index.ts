import { NgModule } from '@angular/core';

import { BrnContextMenuTriggerDirective } from './lib/brn-context-menu-trigger.directive';
import { BrnMenuBarDirective } from './lib/brn-menu-bar.directive';
import { BrnMenuGroupDirective } from './lib/brn-menu-group.directive';
import { BrnMenuItemCheckboxDirective } from './lib/brn-menu-item-checkbox.directive';
import { BrnMenuItemRadioDirective } from './lib/brn-menu-item-radio.directive';
import { BrnMenuItemDirective } from './lib/brn-menu-item.directive';
import { BrnMenuTriggerDirective } from './lib/brn-menu-trigger.directive';
import { BrnMenuDirective } from './lib/brn-menu.directive';

export * from './lib/brn-context-menu-trigger.directive';
export * from './lib/brn-menu-bar.directive';
export * from './lib/brn-menu-group.directive';
export * from './lib/brn-menu-item-checkbox.directive';
export * from './lib/brn-menu-item-radio.directive';
export * from './lib/brn-menu-item.directive';
export * from './lib/brn-menu-trigger.directive';
export * from './lib/brn-menu.directive';

export const BrnMenuItemImports = [
	BrnMenuGroupDirective,
	BrnMenuItemDirective,
	BrnMenuItemRadioDirective,
	BrnMenuItemCheckboxDirective,
] as const;
export const BrnMenuImports = [BrnMenuTriggerDirective, BrnMenuDirective, ...BrnMenuItemImports] as const;
export const BrnMenuBarImports = [...BrnMenuImports, BrnMenuBarDirective] as const;
export const BrnContextMenuImports = [...BrnMenuImports, BrnContextMenuTriggerDirective] as const;

@NgModule({
	imports: [...BrnMenuItemImports],
	exports: [...BrnMenuItemImports],
})
export class BrnMenuItemModule {}

@NgModule({
	imports: [...BrnMenuImports],
	exports: [...BrnMenuImports],
})
export class BrnMenuModule {}

@NgModule({
	imports: [...BrnMenuBarImports],
	exports: [...BrnMenuBarImports],
})
export class BrnMenuBarModule {}

@NgModule({
	imports: [...BrnContextMenuImports],
	exports: [...BrnContextMenuImports],
})
export class BrnContextMenuModule {}
