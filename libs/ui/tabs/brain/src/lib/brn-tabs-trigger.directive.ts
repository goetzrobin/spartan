import { computed, Directive, ElementRef, inject, Input } from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: 'button[brnTabsTrigger]',
	standalone: true,
	host: {
		'[id]': 'labelId',
		type: 'button',
		role: 'tab',
		'[tabindex]': 'selected() ? "0": "-1"',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-controls]': 'contentId',
		'[attr.data-state]': "selected() ? 'active' : 'inactive'",
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-disabled]': "disabled ? '' : undefined",
		'(click)': 'activate()',
	},
})
export class BrnTabsTriggerDirective {
	public readonly elementRef = inject(ElementRef);

	private readonly _root = inject(BrnTabsDirective);
	private _key: string | undefined;

	protected contentId: string | undefined;
	protected labelId: string | undefined;
	protected readonly _orientation = this._root.$orientation;

	public readonly selected = computed(() => this._root.$value() === this._key);

	@Input('brnTabsTrigger')
	set triggerFor(key: string) {
		this._key = key;
		this.contentId = 'brn-tabs-content-' + this._key;
		this.labelId = 'brn-tabs-label-' + this._key;
		this._root.registerTrigger(key, this);
	}
	@Input()
	public disabled = false;

	public focus() {
		this.elementRef.nativeElement.focus();
		if (this._root.$activationMode() === 'automatic') {
			this.activate();
		}
	}

	public activate() {
		if (!this._key) return;
		this._root.setValue(this._key);
	}

	get key(): string | undefined {
		return this._key;
	}
}
