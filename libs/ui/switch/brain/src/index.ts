import { NgModule } from '@angular/core';

import { BrnSwitchThumbComponent } from './lib/brn-switch-thumb.component';
import { BrnSwitchComponent } from './lib/brn-switch.component';

export * from './lib/brn-switch-thumb.component';
export * from './lib/brn-switch.component';

export const BrnSwitchImports = [BrnSwitchComponent, BrnSwitchThumbComponent] as const;

@NgModule({
	imports: [...BrnSwitchImports],
	exports: [...BrnSwitchImports],
})
export class BrnSwitchModule {}
