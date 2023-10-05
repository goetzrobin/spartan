import { AfterContentInit, Component, ContentChild } from '@angular/core';
import { BrnHoverCardTriggerDirective } from './brn-hover-card-trigger.directive';
import { BrnHoverCardContentDirective } from './brn-hover-card-content.directive';
import { BrnHoverCardContentService } from './brn-hover-card-content.service';

@Component({
  selector: 'brn-hover-card',
  standalone: true,
  providers: [BrnHoverCardContentService],
  template: ` <ng-content />`,
})
export class BrnHoverCardComponent implements AfterContentInit {
  @ContentChild(BrnHoverCardTriggerDirective, { static: true })
  private _trigger?: BrnHoverCardTriggerDirective;
  @ContentChild(BrnHoverCardContentDirective, { static: true })
  private _content?: BrnHoverCardContentDirective;

  public ngAfterContentInit() {
    if (!this._trigger || !this._content) return;
    this._trigger.brnHoverCardTriggerFor = this._content;
  }
}
