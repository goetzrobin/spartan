import { type AfterContentInit, Component, contentChild } from '@angular/core';
import {
	BrnHoverCardContentDirective,
	BrnHoverCardContentService,
	BrnHoverCardTriggerDirective,
} from './brn-hover-card-content.service';

@Component({
	selector: 'brn-hover-card',
	standalone: true,
	providers: [BrnHoverCardContentService],
	template: `
		<ng-content />
	`,
})
export class BrnHoverCardComponent implements AfterContentInit {
	private readonly _trigger = contentChild(BrnHoverCardTriggerDirective);
	private readonly _content = contentChild(BrnHoverCardContentDirective);

	public ngAfterContentInit() {
		if (!this._trigger() || !this._content()) return;
		this._trigger()?.brnHoverCardTriggerForState().set(this._content());
	}
}
