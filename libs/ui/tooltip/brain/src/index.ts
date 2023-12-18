import { NgModule } from '@angular/core';
import { BrnTooltipComponent } from './lib/brn-tooltip.component';
import { BrnTooltipDirective } from './lib/brn-tooltip.directive';

export * from './lib/brn-tooltip.component';
export * from './lib/brn-tooltip.directive';
export const BrnTooltipImports = [BrnTooltipDirective, BrnTooltipComponent] as const;

@NgModule({
	imports: [...BrnTooltipImports],
	exports: [...BrnTooltipImports],
})
export class BrnTooltipModule {}
