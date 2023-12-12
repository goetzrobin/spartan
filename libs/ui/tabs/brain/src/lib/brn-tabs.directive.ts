import { Directive, Input, signal } from '@angular/core';
import { BrnTabsContentDirective } from './brn-tabs-content.directive';
import { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';

export type BrnTabsOrientation = 'horizontal' | 'vertical';
export type BrnTabsDirection = 'ltr' | 'rtl';
export type BrnActivationMode = 'automatic' | 'manual';

@Directive({
	selector: '[brnTabs]',
	standalone: true,
	host: {
		'[attr.data-orientation]': '_orientation()',
		'[attr.dir]': '_direction()',
	},
})
export class BrnTabsDirective {
	protected readonly _orientation = signal<BrnTabsOrientation>('horizontal');
	@Input()
	set orientation(value: BrnTabsOrientation) {
		this._orientation.set(value);
	}
	/** internal **/
	$orientation = this._orientation.asReadonly();

	protected readonly _direction = signal<BrnTabsDirection>('ltr');
	@Input()
	set direction(value: BrnTabsDirection) {
		this._direction.set(value);
	}
	/** internal **/
	$direction = this._direction.asReadonly();

	protected readonly _value = signal<string | undefined>(undefined);
	@Input('brnTabs')
	set value(value: string) {
		this._value.set(value);
	}
	/** internal **/
	$value = this._value.asReadonly();

	protected readonly _activationMode = signal<BrnActivationMode>('automatic');
	@Input()
	set activationMode(value: BrnActivationMode) {
		this._activationMode.set(value);
	}
	/** internal **/
	$activationMode = this._activationMode.asReadonly();

	private _tabs: { [key: string]: { trigger: BrnTabsTriggerDirective; content: BrnTabsContentDirective } } = {};
	public readonly $tabs = this._tabs;

	public registerTrigger(key: string, trigger: BrnTabsTriggerDirective) {
		this._tabs[key] = {
			...(this._tabs[key] ?? {}),
			trigger,
		};
	}

	public registerContent(key: string, content: BrnTabsContentDirective) {
		this._tabs[key] = {
			...(this._tabs[key] ?? {}),
			content,
		};
	}

	setValue(key: string) {
		this._value.set(key);
	}
}
