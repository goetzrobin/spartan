import { NgModule } from '@angular/core';
import { HlmToggleGroupDirective } from './lib/hlm-toggle-group.directive';
import { HlmToggleDirective } from './lib/hlm-toggle.directive';

export * from './lib/hlm-toggle-group.directive';
export * from './lib/hlm-toggle.directive';
@NgModule({
	imports: [HlmToggleDirective],
	exports: [HlmToggleDirective],
})
export class HlmToggleModule {}

@NgModule({
	imports: [HlmToggleDirective, HlmToggleGroupDirective],
	exports: [HlmToggleDirective, HlmToggleGroupDirective],
})
export class HlmToggleGroupModule {}
