import { computed, Directive, ElementRef, inject, Input } from '@angular/core';
import { BrnTabsComponent } from './brn-tabs.component';

@Directive({
	selector: '[brnTabsContent]',
	standalone: true,
	host: {
		role: 'tabpanel',
		tabindex: '0',
		'[id]': 'contentId',
		'[attr.aria-labelledby]': 'labelId',
		'[hidden]': '_isSelected() === false',
	},
})
export class BrnTabsContentDirective {
	private _root = inject(BrnTabsComponent);
	private _elementRef = inject(ElementRef);

	private _key: string | undefined;
	protected contentId: string | undefined;
	protected labelId: string | undefined;
	protected readonly _isSelected = computed(() => this._root.$value() === this._key);

	@Input('brnTabsContent')
	set contentFor(key: string) {
		this._key = key;
		this.contentId = 'brn-tabs-content-' + this._key;
		this.labelId = 'brn-tabs-label-' + this._key;
		this._root.registerContent(key, this);
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}
