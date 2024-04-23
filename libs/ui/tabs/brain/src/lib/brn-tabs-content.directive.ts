import { computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: '[brnTabsContent]',
	standalone: true,
	host: {
		role: 'tabpanel',
		tabindex: '0',
		'[id]': 'contentId()',
		'[attr.aria-labelledby]': 'labelId()',
		'[hidden]': '_isSelected() === false',
	},
	exportAs: 'brnTabsContent',
})
export class BrnTabsContentDirective {
	private _root = inject(BrnTabsDirective);
	private _elementRef = inject(ElementRef);

	public readonly contentFor = input.required<string>({ alias: 'brnTabsContent' });
	protected readonly _isSelected = computed(() => this._root.$value() === this.contentFor());
	protected contentId = computed(() => 'brn-tabs-content-' + this.contentFor());
	protected labelId = computed(() => 'brn-tabs-label-' + this.contentFor());

	constructor() {
		effect(() => {
			this._root.registerContent(this.contentFor(), this);
		});
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}
