import { NgModule } from '@angular/core';
import { HlmSelectContentDirective } from './lib/hlm-select-content.directive';
import { HlmSelectOptionComponent } from './lib/hlm-select-option.component';
import { HlmSelectScrollDownDirective } from './lib/hlm-select-scroll-down.directive';
import { HlmSelectScrollUpDirective } from './lib/hlm-select-scroll-up.directive';
import { HlmSelectTriggerComponent } from './lib/hlm-select-trigger.component';
import { HlmSelectValueDirective } from './lib/hlm-select-value.directive';
import { HlmSelectDirective } from './lib/hlm-select.directive';

export * from './lib/hlm-select-content.directive';
export * from './lib/hlm-select-option.component';
export * from './lib/hlm-select-scroll-down.directive';
export * from './lib/hlm-select-scroll-up.directive';
export * from './lib/hlm-select-trigger.component';
export * from './lib/hlm-select-value.directive';
export * from './lib/hlm-select.directive';

export const HlmSelectImports = [
	HlmSelectContentDirective,
	HlmSelectTriggerComponent,
	HlmSelectOptionComponent,
	HlmSelectValueDirective,
	HlmSelectDirective,
	HlmSelectScrollUpDirective,
	HlmSelectScrollDownDirective,
] as const;

@NgModule({
	imports: [...HlmSelectImports],
	exports: [...HlmSelectImports],
})
export class HlmSelectModule {}
