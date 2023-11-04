import { NgModule } from '@angular/core';
import { HlmTooltipDirective } from './lib/hlm-tooltip.directive';

export * from './lib/hlm-tooltip.directive';

export const HlmTooltipImports = [HlmTooltipDirective] as const;

@NgModule({
	imports: [...HlmTooltipImports],
	exports: [...HlmTooltipImports],
})
export class HlmTooltipModule {}
