import { computed, Directive, ElementRef, inject, Input } from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: 'button[brnTabsTrigger]',
	standalone: true,
	host: {
		'[id]': 'labelId',
		type: 'button',
		role: 'tab',
		'[tabindex]': '_isSelected() ? "0": "-1"',
		'[attr.aria-selected]': '_isSelected()',
		'[attr.aria-controls]': 'contentId',
		'[attr.data-state]': "_isSelected() ? 'active' : 'inactive'",
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-disabled]': "disabled ? '' : undefined",
		'(click)': 'activate()',
	},
})
export class BrnTabsTriggerDirective {
	private _root = inject(BrnTabsDirective);
	private _elementRef = inject(ElementRef);

	private _key: string | undefined;
	protected contentId: string | undefined;
	protected labelId: string | undefined;
	protected readonly _orientation = this._root.$orientation;
	protected readonly _isSelected = computed(() => this._root.$value() === this._key);

	@Input('brnTabsTrigger')
	set triggerFor(key: string) {
		this._key = key;
		this.contentId = 'brn-tabs-content-' + this._key;
		this.labelId = 'brn-tabs-label-' + this._key;
		this._root.registerTrigger(key, this);
	}
	@Input()
	public disabled = false;

	public setTriggerFor(key: string) {
		this.triggerFor = key;
	}

	public focus() {
		this._elementRef.nativeElement.focus();
		if (this._root.$activationMode() === 'automatic') {
			this.activate();
		}
	}

	public activate() {
		if (!this._key) return;
		this._root.setValue(this._key);
	}
}
