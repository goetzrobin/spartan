import { AfterContentInit, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { fromEvent } from 'rxjs';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';
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
export class BrnAccordionTriggerDirective implements AfterContentInit {
	private _accordion = inject(BrnAccordionDirective);
	private _item = inject(BrnAccordionItemComponent);
	private _elementRef = inject(ElementRef);
	private _HostPressedListener = rxHostPressedListener();

	public state = this._item.state;
	public id = 'brn-accordion-trigger-' + this._item.id;
	public ariaControls = 'brn-accordion-content-' + this._item.id;

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}

		if (!this._item) {
			throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
		this._HostPressedListener.subscribe(() => {
			this._accordion.toggleItem(this._item.id);
		});

		fromEvent(this._elementRef.nativeElement, 'focus')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this._accordion.setActiveItem(this._item.id);
			});
	}
	ngAfterContentInit(): void {
		console.log('BrnAccordionTriggerDirective.ngAfterContentInit');
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}
