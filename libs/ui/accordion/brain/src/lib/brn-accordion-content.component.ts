import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { CustomElementClassSettable } from '@spartan-ng/ui-core';
import { BrnAccordionItemDirective } from './brn-accordion-item.directive';

@Component({
	selector: 'brn-accordion-content, hlm-accordion-content',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
	},
	template: `
		<div [attr.inert]="_addInert()" style="overflow: hidden">
			<p [class]="_contentClass()">
				<ng-content />
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAccordionContentComponent implements CustomElementClassSettable {
	private readonly _item = inject(BrnAccordionItemDirective);

	public readonly state = this._item.state;
	public readonly id = 'brn-accordion-content-' + this._item.id;
	public readonly ariaLabeledBy = 'brn-accordion-trigger-' + this._item.id;

	protected readonly _addInert = computed(() => (this.state() === 'closed' ? true : undefined));
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
