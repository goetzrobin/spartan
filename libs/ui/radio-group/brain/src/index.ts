import { NgModule } from '@angular/core';

import { BrnRadioComponent, BrnRadioGroupComponent } from './lib/brn-radio.component';

export * from './lib/brn-radio.component';

export const BrnRadioGroupImports = [BrnRadioGroupComponent, BrnRadioComponent] as const;

@NgModule({
	imports: [...BrnRadioGroupImports],
	exports: [...BrnRadioGroupImports],
})
export class BrnRadioGroupModule {}
