import { NgModule } from '@angular/core';

import { HlmRadioGroupComponent } from './lib/hlm-radio-group.component';
import { HlmRadioGroupDirective } from './lib/hlm-radio-group.directive';
import { HlmRadioIndicatorComponent } from './lib/hlm-radio-indicator.component';
import { HlmRadioComponent } from './lib/hlm-radio.component';
import { HlmRadioDirective } from './lib/hlm-radio.directive';

export * from './lib/hlm-radio-group.component';
export * from './lib/hlm-radio-group.directive';
export * from './lib/hlm-radio-indicator.component';
export * from './lib/hlm-radio.component';
export * from './lib/hlm-radio.directive';

export const HlmRadioGroupImports = [
	HlmRadioGroupComponent,
	HlmRadioComponent,
	HlmRadioGroupDirective,
	HlmRadioDirective,
	HlmRadioIndicatorComponent,
];

@NgModule({
	imports: [...HlmRadioGroupImports],
	exports: [...HlmRadioGroupImports],
})
export class HlmRadioGroupModule {}
