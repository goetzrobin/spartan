import { NgModule } from '@angular/core';
import { BrnHoverCardContentDirective, BrnHoverCardTriggerDirective } from './lib/brn-hover-card-content.service';
import { BrnHoverCardComponent } from './lib/brn-hover-card.component';

export * from './lib/brn-hover-card-content.service';
export * from './lib/brn-hover-card.component';
export * from './lib/createHoverObservable';

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
