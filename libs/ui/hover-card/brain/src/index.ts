import { NgModule } from '@angular/core';
import { BrnHoverCardComponent } from './lib/brn-hover-card.component';
import { BrnHoverCardContentDirective } from './lib/brn-hover-card-content.directive';
import { BrnHoverCardTriggerDirective } from './lib/brn-hover-card-trigger.directive';

export { BrnHoverCardComponent } from './lib/brn-hover-card.component';
export { BrnHoverCardContentDirective } from './lib/brn-hover-card-content.directive';
export { BrnHoverCardContentService, BrnHoverCardOptions } from './lib/brn-hover-card-content.service';
export { BrnHoverCardTriggerDirective } from './lib/brn-hover-card-trigger.directive';
export { createHoverObservable } from './lib/createHoverObservable';

export const BrnHoverCardImports = [
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardTriggerDirective,
] as const;

@NgModule({
  imports: [...BrnHoverCardImports],
  exports: [...BrnHoverCardImports],
})
export class BrnHoverCardModule {}
