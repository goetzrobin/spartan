import { Directive, forwardRef, inject, TemplateRef } from '@angular/core';
import { EXPOSES_SIDE_TOKEN, EXPOSES_STATE_TOKEN, ExposesSide, ExposesState } from '@spartan-ng/ui-core';
import { BrnHoverCardContentService } from './brn-hover-card-content.service';

@Directive({
  selector: '[brnHoverCardContent]',
  standalone: true,
  exportAs: 'brnHoverCardContent',
  providers: [
    {
      provide: EXPOSES_STATE_TOKEN,
      useExisting: forwardRef(() => BrnHoverCardContentDirective),
    },
    {
      provide: EXPOSES_SIDE_TOKEN,
      useExisting: forwardRef(() => BrnHoverCardContentDirective),
    },
  ],
})
export class BrnHoverCardContentDirective implements ExposesState, ExposesSide {
  private readonly _contentService = inject(BrnHoverCardContentService);
  public readonly state = this._contentService.state;
  public readonly side = this._contentService.side;
  public readonly template = inject(TemplateRef);
}
