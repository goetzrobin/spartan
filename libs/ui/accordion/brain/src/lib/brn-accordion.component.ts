import { AfterContentInit, Component, computed, ContentChildren, Input, QueryList, signal } from '@angular/core';
import { BrnAccordionTriggerComponent } from './brn-accordion-trigger.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { rxHostListener } from '@ng-spartan/ui/core/brain';

@Component({
  selector: 'brn-accordion',
  standalone: true,
  host: {
    '[attr.data-state]': 'state()',
    '[attr.data-orientation]': 'orientation'
  },
  template: `
    <ng-content />`
})
export class BrnAccordionComponent implements AfterContentInit {
  @Input()
  public type: 'single' | 'multiple' = 'single';
  @Input()
  public dir: 'ltr' | 'rtl' | null = null;
  @Input()
  public orientation: 'horizontal' | 'vertical' = 'horizontal';

  private _openItemIds = signal<number[]>([]);
  public openItemIds = this._openItemIds.asReadonly();
  public state = computed(() => (this._openItemIds().length > 0 ? 'open' : 'closed'));
  private _keyManager?: FocusKeyManager<BrnAccordionTriggerComponent>;
  private _keyDownListener = rxHostListener('keydown');

  @ContentChildren(BrnAccordionTriggerComponent, { descendants: true })
  public triggers?: QueryList<BrnAccordionTriggerComponent>;

  public ngAfterContentInit() {
    if (!this.triggers) {
      return;
    }
    this._keyManager = new FocusKeyManager<BrnAccordionTriggerComponent>(this.triggers)
      .withHorizontalOrientation(this.dir)
      .withHomeAndEnd()
      .withPageUpDown()
      .withWrap();

    if (this.orientation === 'vertical') {
      this._keyManager.withVerticalOrientation();
    }
    this._keyDownListener.subscribe((event) => {
      this._keyManager?.onKeydown(event as KeyboardEvent);
    });
  }

  public toggleItem(id: number) {
    if (this._openItemIds().includes(id)) {
      this._openItemIds.mutate((ids) =>
        ids.splice(
          ids.findIndex((openId) => id === openId),
          1
        )
      );
      return;
    } else if (this.type === 'single') {
      this._openItemIds.set([]);
    }
    this._openItemIds.mutate((ids) => ids.push(id));
  }
}
