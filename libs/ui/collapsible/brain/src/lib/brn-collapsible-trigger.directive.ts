import { Directive, computed, inject } from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

@Directive({
	selector: 'button[brnCollapsibleTrigger]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.disabled]': 'attrDisabled()',
		'[attr.aria-expanded]': 'state() === "open"',
		'[attr.aria-controls]': 'ariaControls()',
		'(click)': 'toggleCollapsible()',
	},
})
export class BrnCollapsibleTriggerDirective {
	private readonly _collapsible = inject(BrnCollapsibleComponent, { optional: true });

	public readonly state = computed(() => this._collapsible?.state());

	public readonly disabled = computed(() => this._collapsible?.disabled?.());

	public readonly attrDisabled = computed(() => this._collapsible?.attrDisabled?.());

	public readonly ariaControls = computed(() => this._collapsible?.contentId());

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggleCollapsible() {
		this._collapsible?.toggle();
	}
}
