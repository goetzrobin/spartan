import { Directive, ElementRef, Input, computed, effect, inject, input } from '@angular/core';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: 'button[brnTabsTrigger]',
	standalone: true,
	host: {
		'[id]': 'labelId()',
		type: 'button',
		role: 'tab',
		'[tabindex]': 'selected() ? "0": "-1"',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-controls]': 'contentId()',
		'[attr.data-state]': "selected() ? 'active' : 'inactive'",
		'[attr.data-orientation]': '_orientation()',
		'[attr.data-disabled]': "disabled ? '' : undefined",
		'(click)': 'activate()',
	},
	exportAs: 'brnTabsTrigger',
})
export class BrnTabsTriggerDirective {
	public readonly elementRef = inject(ElementRef);

	private readonly _root = inject(BrnTabsDirective);

	protected readonly _orientation = this._root.$orientation;

	public readonly triggerFor = input.required<string>({ alias: 'brnTabsTrigger' });
	public readonly selected = computed(() => this._root.$activeTab() === this.triggerFor());
	protected readonly contentId = computed(() => `brn-tabs-content-${this.triggerFor()}`);
	protected readonly labelId = computed(() => `brn-tabs-label-${this.triggerFor()}`);

	// leaving this as an @input to be compatible with the `FocusKeyManager` used in the `BrnTabsListDirective`
	@Input()
	public disabled = false;

	constructor() {
		effect(
			() => {
				this._root.registerTrigger(this.triggerFor(), this);
			},
			{ allowSignalWrites: true },
		);
	}

	public focus() {
		this.elementRef.nativeElement.focus();
		if (this._root.$activationMode() === 'automatic') {
			this.activate();
		}
	}

	public activate() {
		if (!this.triggerFor()) return;
		this._root.setActiveTab(this.triggerFor());
		this._root.emitTabActivated(this.triggerFor());
	}

	get key(): string | undefined {
		return this.triggerFor();
	}
}
