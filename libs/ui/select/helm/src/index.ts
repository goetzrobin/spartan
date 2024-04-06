import { NgModule } from '@angular/core';
import { HlmSelectContentComponent } from './lib/hlm-select-content.component';
import { HlmSelectGroupDirective } from './lib/hlm-select-group.directive';
import { HlmSelectLabelDirective } from './lib/hlm-select-label.directive';
import { HlmSelectOptionComponent } from './lib/hlm-select-option.component';
import { HlmSelectScrollDownComponent } from './lib/hlm-select-scroll-down.component';
import { HlmSelectScrollUpComponent } from './lib/hlm-select-scroll-up.component';
import { HlmSelectTriggerComponent } from './lib/hlm-select-trigger.component';
import { HlmSelectValueComponent } from './lib/hlm-select-value.directive';
import { HlmSelectComponent } from './lib/hlm-select.component';

export * from './lib/hlm-select-content.component';
export * from './lib/hlm-select-group.directive';
export * from './lib/hlm-select-label.directive';
export * from './lib/hlm-select-option.component';
export * from './lib/hlm-select-scroll-down.component';
export * from './lib/hlm-select-scroll-up.component';
export * from './lib/hlm-select-trigger.component';
export * from './lib/hlm-select-value.directive';
export * from './lib/hlm-select.component';

export const HlmSelectImports = [
	HlmSelectContentComponent,
	HlmSelectTriggerComponent,
	HlmSelectOptionComponent,
	HlmSelectValueComponent,
	HlmSelectComponent,
	HlmSelectScrollUpComponent,
	HlmSelectScrollDownComponent,
	HlmSelectLabelDirective,
	HlmSelectGroupDirective,
] as const;

@NgModule({
	imports: [...HlmSelectImports],
	exports: [...HlmSelectImports],
})
export class HlmSelectModule {}
