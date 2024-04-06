import { NgModule } from '@angular/core';
import { BrnSelectContentDirective } from './lib/brn-select-content.directive';
import { BrnSelectGroupDirective } from './lib/brn-select-group.directive';
import { BrnSelectLabelDirective } from './lib/brn-select-label.directive';
import { BrnSelectOptionDirective } from './lib/brn-select-option.directive';
import { BrnSelectScrollDownDirective } from './lib/brn-select-scroll-down.directive';
import { BrnSelectScrollUpDirective } from './lib/brn-select-scroll-up.directive';
import { BrnSelectTriggerDirective } from './lib/brn-select-trigger.directive';
import { BrnSelectValueDirective } from './lib/brn-select-value.directive';
import { BrnSelectDirective } from './lib/brn-select.directive';

export * from './lib/brn-select-content.directive';
export * from './lib/brn-select-group.directive';
export * from './lib/brn-select-label.directive';
export * from './lib/brn-select-option.directive';
export * from './lib/brn-select-scroll-down.directive';
export * from './lib/brn-select-scroll-up.directive';
export * from './lib/brn-select-trigger.directive';
export * from './lib/brn-select-value.directive';
export * from './lib/brn-select.directive';
export * from './lib/brn-select.service';

export const BrnSelectImports = [
	BrnSelectDirective,
	BrnSelectContentDirective,
	BrnSelectTriggerDirective,
	BrnSelectOptionDirective,
	BrnSelectValueDirective,
	BrnSelectScrollDownDirective,
	BrnSelectScrollUpDirective,
	BrnSelectGroupDirective,
	BrnSelectLabelDirective,
] as const;

@NgModule({
	imports: [...BrnSelectImports],
	exports: [...BrnSelectImports],
})
export class BrnSelectModule {}
