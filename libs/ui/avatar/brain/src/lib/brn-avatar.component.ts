import { NgIf, NgIfContext } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BrnAvatarFallbackDirective } from './fallback';
import { BrnAvatarImageDirective } from './image';

@Component({
  selector: 'brn-avatar',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content select="[brnAvatarImage]" *ngIf="image?.canShow(); else fallbackTemplate" />`,
})
export class BrnAvatarComponent {
  @ContentChild(BrnAvatarFallbackDirective, { static: true, read: TemplateRef })
  protected readonly fallbackTemplate: TemplateRef<NgIfContext<boolean | undefined>> | null = null;

  @ContentChild(BrnAvatarImageDirective, { static: true })
  protected readonly image: BrnAvatarImageDirective | null = null;
}
