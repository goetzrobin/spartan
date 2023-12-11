import { NgModule } from '@angular/core';

import { HlmCheckboxCheckIconComponent } from './lib/hlm-checkbox-checkicon.component';
import { HlmCheckboxDirective } from './lib/hlm-checkbox.directive';

export * from './lib/hlm-checkbox-checkicon.component';
export * from './lib/hlm-checkbox.directive';

export const HlmCheckboxImports = [HlmCheckboxDirective, HlmCheckboxCheckIconComponent] as const;
@NgModule({
	imports: [...HlmCheckboxImports],
	exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
