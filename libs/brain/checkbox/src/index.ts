import { NgModule } from '@angular/core';

import { BrnCheckboxComponent } from './lib/brn-checkbox.component';

export * from './lib/brn-checkbox.component';

export const BrnCheckboxImports = [BrnCheckboxComponent] as const;

@NgModule({
	imports: [...BrnCheckboxImports],
	exports: [...BrnCheckboxImports],
})
export class BrnCheckboxModule {}
