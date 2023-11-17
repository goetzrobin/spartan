import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	forwardRef,
	inject,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { CustomElementClassSettable, SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN } from '@spartan-ng/ui-core';
import { BrnAccordionItemComponent } from './brn-accordion-item.component';

@Component({
	selector: 'brn-accordion-content',
	standalone: true,
	providers: [
		{
			provide: SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
			useExisting: forwardRef(() => BrnAccordionContentComponent),
		},
	],
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[style.--brn-collapsible-content-height]': 'initialHeight + "px"',
		'[id]': 'id',
	},
	template: `
		<p [class]="contentClass()">
			<ng-content />
		</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAccordionContentComponent implements AfterViewInit, CustomElementClassSettable {
	private _item = inject(BrnAccordionItemComponent);
	private _element = inject(ElementRef).nativeElement;

	public state = this._item.state;
	public id = 'brn-accordion-content-' + this._item.id;
	public ariaLabeledBy = 'brn-accordion-trigger-' + this._item.id;
	protected initialHeight = 0;

	private readonly _contentClass = signal('');
	public readonly contentClass = this._contentClass.asReadonly();

	constructor() {
		if (!this._item) {
			throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}

	public ngAfterViewInit() {
		Promise.resolve().then(() => {
			this.initialHeight = this._element.offsetHeight;
		});
	}

	public setClassToCustomElement(classes: string) {
		this._contentClass.set(classes);
	}
}
