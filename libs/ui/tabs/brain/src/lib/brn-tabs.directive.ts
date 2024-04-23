import { Directive, EventEmitter, Input, Output, input, signal } from '@angular/core';
import { BrnTabsContentDirective } from './brn-tabs-content.directive';
import { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';

export type BrnTabsOrientation = 'horizontal' | 'vertical';
export type BrnTabsDirection = 'ltr' | 'rtl';
export type BrnActivationMode = 'automatic' | 'manual';

@Directive({
	selector: '[brnTabs]',
	standalone: true,
	host: {
		'[attr.data-orientation]': 'orientation()',
		'[attr.dir]': 'direction()',
	},
	exportAs: 'brnTabs',
})
export class BrnTabsDirective {
	public readonly orientation = input<BrnTabsOrientation>('horizontal');
	/** internal **/
	$orientation = this.orientation;

	public readonly direction = input<BrnTabsDirection>('ltr');
	/** internal **/
	$direction = this.direction;
	@Output()
	readonly tabActivated = new EventEmitter<string>();

	// leaving this as an @input and signal to be set programmatically
	// current limitation by InputSignal which are readonly
	protected readonly _value = signal<string | undefined>(undefined);
	@Input('brnTabs')
	set value(value: string) {
		this._value.set(value);
	}
	/** internal **/
	$value = this._value.asReadonly();

	public readonly activationMode = input<BrnActivationMode>('automatic');
	/** internal **/
	$activationMode = this.activationMode;

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
	emitTabActivated(key: string) {
		this.tabActivated.emit(key);
	}
	setValue(key: string) {
		this._value.set(key);
	}
}
