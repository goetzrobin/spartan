import { NgModule } from '@angular/core';

import { HlmMenuShortcutComponent } from './lib/hlm-menu-shortcut.component';
import { HlmMenuSeparatorComponent } from './lib/hlm-menu-separator.component';
import { HlmMenuLabelComponent } from './lib/hlm-menu-label.component';
import { HlmMenuItemRadioComponent } from './lib/hlm-menu-item-radio.component';
import { HlmMenuItemCheckComponent } from './lib/hlm-menu-item-check.component';
import { HlmMenuItemSubIndicatorComponent } from './lib/hlm-menu-item-sub-indicator.component';
import { HlmMenuItemIconDirective } from './lib/hlm-menu-item-icon.directive';
import { HlmMenuItemDirective } from './lib/hlm-menu-item.directive';
import { HlmMenuBarDirective } from './lib/hlm-menu-bar.directive';
import { HlmMenuBarItemDirective } from './lib/hlm-menu-bar-item.directive';
import { HlmMenuDirective } from './lib/hlm-menu.directive';
import { HlmSubMenuDirective } from './lib/hlm-sub-menu.directive';

export * from './lib/hlm-menu.directive';
export * from './lib/hlm-menu-bar.directive';
export * from './lib/hlm-menu-bar-item.directive';
export * from './lib/hlm-sub-menu.directive';
export * from './lib/hlm-menu-item.directive';
export * from './lib/hlm-menu-item-icon.directive';
export * from './lib/hlm-menu-item-sub-indicator.component';
export * from './lib/hlm-menu-item-check.component';
export * from './lib/hlm-menu-item-radio.component';
export * from './lib/hlm-menu-label.component';
export * from './lib/hlm-menu-shortcut.component';
export * from './lib/hlm-menu-separator.component';

export const HlmMenuItemImports = [
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuItemRadioComponent,
  HlmMenuItemCheckComponent,
  HlmMenuShortcutComponent,
];
export const HlmMenuStructureImports = [HlmMenuLabelComponent, HlmMenuSeparatorComponent] as const;
export const HlmMenuImports = [
  ...HlmMenuItemImports,
  ...HlmMenuStructureImports,
  HlmMenuDirective,
  HlmSubMenuDirective,
] as const;
export const HlmMenuBarImports = [...HlmMenuImports, HlmMenuBarDirective, HlmMenuBarItemDirective] as const;

@NgModule({
  imports: [...HlmMenuItemImports],
  exports: [...HlmMenuItemImports],
})
export class HlmMenuItemModule {}

@NgModule({
  imports: [...HlmMenuImports],
  exports: [...HlmMenuImports],
})
export class HlmMenuModule {}

@NgModule({
  imports: [...HlmMenuBarImports],
  exports: [...HlmMenuBarImports],
})
export class HlmMenuBarModule {}
