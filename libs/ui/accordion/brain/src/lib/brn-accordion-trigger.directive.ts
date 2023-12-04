import { Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { fromEvent } from 'rxjs';
import { BrnAccordionItemDirective } from './brn-accordion-item.directive';
import { BrnAccordionDirective } from './brn-accordion.directive';

@Directive({
	selector: '[brnAccordionTrigger]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-expanded]': 'state() === "open"',
		'[attr.aria-controls]': 'ariaControls',
		role: 'heading',
		'aria-level': '3',
		'[id]': 'id',
	},
})
export class BrnAccordionTriggerDirective {
	private readonly _accordion = inject(BrnAccordionDirective);
	private readonly _item = inject(BrnAccordionItemDirective);
	private readonly _elementRef = inject(ElementRef);
	private readonly _hostPressedListener = rxHostPressedListener();

	public readonly state = this._item.state;
	public readonly id = 'brn-accordion-trigger-' + this._item.id;
	public readonly ariaControls = 'brn-accordion-content-' + this._item.id;

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}

		if (!this._item) {
			throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
		this._hostPressedListener.subscribe(() => {
			this._accordion.toggleItem(this._item.id);
		});

		fromEvent(this._elementRef.nativeElement, 'focus')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this._accordion.setActiveItem(this);
			});
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}
