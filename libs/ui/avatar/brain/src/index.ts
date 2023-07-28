import { NgModule } from '@angular/core';

import { BrnAvatarComponent } from './lib/brn-avatar.component';
import { BrnAvatarFallbackDirective } from './lib/fallback';
import { BrnAvatarImageDirective } from './lib/image';

export * from './lib/brn-avatar.component';
export * from './lib/fallback';
export * from './lib/image';
export * from './lib/util';

export const BrnAvatarImports = [BrnAvatarComponent, BrnAvatarFallbackDirective, BrnAvatarImageDirective] as const;

@NgModule({
  imports: [...BrnAvatarImports],
  exports: [...BrnAvatarImports],
})
export class BrnAvatarModule {}
