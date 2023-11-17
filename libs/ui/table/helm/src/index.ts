import { NgModule } from '@angular/core';

import { HlmTableComponent } from './lib/hlm-table.component';
import { HlmTableDirective } from './lib/hlm-table.directive';
import { HlmTdComponent } from './lib/hlm-td.component';
import { HlmThComponent } from './lib/hlm-th.component';
import { HlmTrowComponent } from './lib/hlm-trow.component';

export { HlmTableComponent } from './lib/hlm-table.component';
export { HlmTableDirective } from './lib/hlm-table.directive';
export { HlmTdComponent } from './lib/hlm-td.component';
export { HlmThComponent } from './lib/hlm-th.component';
export { HlmTrowComponent } from './lib/hlm-trow.component';

export const HlmTableImports = [
	HlmTableComponent,
	HlmTableDirective,
	HlmThComponent,
	HlmTdComponent,
	HlmTrowComponent,
] as const;

@NgModule({
	imports: [...HlmTableImports],
	exports: [...HlmTableImports],
})
export class HlmTableModule {}
