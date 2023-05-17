import { Component, ElementRef, forwardRef, inject, signal } from '@angular/core';
import { BrnAccordionComponent } from './brn-accordion.component';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';
import { CustomElementClassSettable, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@ng-spartan/ui/core/brain';

@Component({
  selector: 'brn-accordion-trigger',
  standalone: true,
  providers: [
    {
      provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
      useExisting: forwardRef(() => BrnAccordionTriggerComponent)
    }
  ],
  host: {
    '[attr.data-state]': 'state()',
    '[attr.aria-expanded]': 'state() === "open"',
    '[attr.aria-controls]': 'ariaControls',
    role: 'heading',
    'aria-level': '3',
    '[id]': 'id'
  },
  template: `
    <button [class]='btnClass()' [attr.data-state]='state()' (click)='toggleAccordionItem()'>
      <ng-content />
    </button>`
})
export class BrnAccordionTriggerComponent implements CustomElementClassSettable {
  private _accordion = inject(BrnAccordionComponent);
  private _item = inject(BrnAccordionItemComponent);
  private _elementRef = inject(ElementRef);

  public state = this._item.state;
  public id = 'brn-accordion-trigger-' + this._item.id;
  public ariaControls = 'brn-accordion-content-' + this._item.id;

  private _btnClass = signal('');
  public btnClass = this._btnClass.asReadonly();

  constructor() {
    if (!this._accordion) {
      throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
    }

    if (!this._item) {
      throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
    }
  }

  public setClassToCustomElement(classes: string) {
    this._btnClass.set(classes);
  }

  public focus() {
    this._elementRef.nativeElement.focus();
  }

  protected toggleAccordionItem() {
    this._accordion.toggleItem(this._item.id);
  }
}
