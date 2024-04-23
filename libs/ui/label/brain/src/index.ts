import { NgModule } from '@angular/core';
import { BrnLabelDirective } from './lib/brn-label.directive';

export * from './lib/brn-label.directive';

@NgModule({
	imports: [BrnLabelDirective],
	exports: [BrnLabelDirective],
})
export class BrnLabelModule {}
