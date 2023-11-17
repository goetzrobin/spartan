import { NgModule } from '@angular/core';
import { HlmButtonDirective } from './lib/hlm-button.directive';

export * from './lib/hlm-button.directive';

@NgModule({
	imports: [HlmButtonDirective],
	exports: [HlmButtonDirective],
})
export class HlmButtonModule {}
