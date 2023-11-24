import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CustomElementClassSettable, provideCustomClassSettableExisting } from '@spartan-ng/ui-core';
import { BrnAccordionItemDirective } from './brn-accordion-item.directive';

@Component({
	selector: 'brn-accordion-content',
	standalone: true,
	providers: [provideCustomClassSettableExisting(() => BrnAccordionContentComponent)],
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
	},
	template: `
		<div class="overflow-hidden">
			<p [class]="_contentClass()">
				<ng-content />
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAccordionContentComponent implements CustomElementClassSettable {
	private _item = inject(BrnAccordionItemDirective);

	public state = this._item.state;
	public id = 'brn-accordion-content-' + this._item.id;
	public ariaLabeledBy = 'brn-accordion-trigger-' + this._item.id;

	protected readonly _contentClass = signal('');

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}

	public setClassToCustomElement(classes: string) {
		this._contentClass.set(classes);
	}
}
