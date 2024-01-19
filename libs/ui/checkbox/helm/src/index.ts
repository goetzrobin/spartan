import { NgModule } from '@angular/core';

import { HlmCheckboxCheckIconComponent } from './lib/hlm-checkbox-checkicon.component';
import { HlmCheckboxComponent } from './lib/hlm-checkbox.component';

export * from './lib/hlm-checkbox-checkicon.component';
export * from './lib/hlm-checkbox.component';

export const HlmCheckboxImports = [HlmCheckboxComponent, HlmCheckboxCheckIconComponent] as const;
@NgModule({
	imports: [...HlmCheckboxImports],
	exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
