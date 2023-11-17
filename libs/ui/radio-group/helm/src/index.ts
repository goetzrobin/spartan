import { NgModule } from '@angular/core';

import { HlmRadioGroupDirective } from './lib/hlm-radio-group.directive';
import { HlmRadioIndicatorComponent } from './lib/hlm-radio-indicator.component';
import { HlmRadioDirective } from './lib/hlm-radio.directive';

export * from './lib/hlm-radio-group.directive';
export * from './lib/hlm-radio-indicator.component';
export * from './lib/hlm-radio.directive';

export const HlmRadioGroupImports = [HlmRadioGroupDirective, HlmRadioDirective, HlmRadioIndicatorComponent];

@NgModule({
	imports: [...HlmRadioGroupImports],
	exports: [...HlmRadioGroupImports],
})
export class HlmRadioGroupModule {}
