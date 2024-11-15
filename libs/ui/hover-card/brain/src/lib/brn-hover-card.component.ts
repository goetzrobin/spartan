import { type AfterContentInit, Component, ContentChild } from '@angular/core';
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
	@ContentChild(BrnHoverCardTriggerDirective, { static: true })
	private readonly _trigger?: BrnHoverCardTriggerDirective;
	@ContentChild(BrnHoverCardContentDirective, { static: true })
	private readonly _content?: BrnHoverCardContentDirective;

	public ngAfterContentInit() {
		if (!this._trigger || !this._content) return;
		this._trigger.brnHoverCardTriggerFor = this._content;
	}
}
