import { NgModule } from '@angular/core';

import { BrnRadioGroupComponent } from './lib/brn-radio-group.component';
import { BrnRadioComponent } from './lib/brn-radio.component';

export * from './lib/brn-radio-change';
export * from './lib/brn-radio-group.component';
export * from './lib/brn-radio.component';

export const BrnRadioGroupImports = [BrnRadioGroupComponent, BrnRadioComponent] as const;

@NgModule({
	imports: [...BrnRadioGroupImports],
	exports: [...BrnRadioGroupImports],
})
export class BrnRadioGroupModule {}
