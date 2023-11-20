import { Directive, inject, TemplateRef } from '@angular/core';
import {
	ExposesSide,
	ExposesState,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/ui-core';
import { BrnHoverCardContentService } from './brn-hover-card-content.service';

@Directive({
	selector: '[brnHoverCardContent]',
	standalone: true,
	exportAs: 'brnHoverCardContent',
	providers: [
		provideExposedSideProviderExisting(() => BrnHoverCardContentDirective),
		provideExposesStateProviderExisting(() => BrnHoverCardContentDirective),
	],
})
export class BrnHoverCardContentDirective implements ExposesState, ExposesSide {
	private readonly _contentService = inject(BrnHoverCardContentService);
	public readonly state = this._contentService.state;
	public readonly side = this._contentService.side;
	public readonly template = inject(TemplateRef);
}
