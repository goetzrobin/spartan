import { BrnMenuTriggerDirective } from './lib/brn-menu-trigger.directive';
import { BrnMenuDirective } from './lib/brn-menu.directive';
import { BrnMenuGroupDirective } from './lib/brn-menu-group.directive';
import { BrnMenuItemDirective } from './lib/brn-menu-item.directive';
import { BrnMenuBarDirective } from './lib/brn-menu-bar.directive';
import { BrnContextMenuTriggerDirective } from './lib/brn-context-menu-trigger.directive';
import { BrnMenuItemRadioDirective } from './lib/brn-menu-item-radio.directive';
import { BrnMenuItemCheckboxDirective } from './lib/brn-menu-item-checkbox.directive';

export * from './lib/brn-menu-trigger.directive';
export * from './lib/brn-context-menu-trigger.directive';
export * from './lib/brn-menu.directive';
export * from './lib/brn-menu-bar.directive';
export * from './lib/brn-menu-group.directive';
export * from './lib/brn-menu-item.directive';
export * from './lib/brn-menu-item-radio.directive';
export * from './lib/brn-menu-item-checkbox.directive';

export const BrnMenuItemImports = [
  BrnMenuGroupDirective,
  BrnMenuItemDirective,
  BrnMenuItemRadioDirective,
  BrnMenuItemCheckboxDirective,
];
export const BrnMenuImports = [BrnMenuTriggerDirective, BrnMenuDirective, BrnMenuItemImports];
export const BrnMenuBarImports = [...BrnMenuImports, BrnMenuBarDirective];
export const BrnContextMenuImports = [...BrnMenuImports, BrnContextMenuTriggerDirective];
