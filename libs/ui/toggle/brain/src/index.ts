import { NgModule } from '@angular/core';
import { BrnToggleGroupComponent } from './lib/brn-toggle-group.component';
import { BrnToggleDirective } from './lib/brn-toggle.directive';

export * from './lib/brn-toggle-group.component';
export * from './lib/brn-toggle.directive';

@NgModule({
	imports: [BrnToggleDirective],
	exports: [BrnToggleDirective],
})
export class BrnToggleModule {}

@NgModule({
	imports: [BrnToggleDirective, BrnToggleGroupComponent],
	exports: [BrnToggleDirective, BrnToggleGroupComponent],
})
export class BrnToggleGroupModule {}
