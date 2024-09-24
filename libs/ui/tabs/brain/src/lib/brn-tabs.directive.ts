import { Directive, EventEmitter, Output, input, model, signal } from '@angular/core';
import type { BrnTabsContentDirective } from './brn-tabs-content.directive';
import type { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';

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

	public readonly _activeTab = model<string | undefined>(undefined, { alias: 'brnTabs' });
	/** internal **/
	$activeTab = this._activeTab.asReadonly();

	public readonly activationMode = input<BrnActivationMode>('automatic');
	/** internal **/
	$activationMode = this.activationMode;

	@Output()
	readonly tabActivated = new EventEmitter<string>();

	private _tabs = signal<{ [key: string]: { trigger: BrnTabsTriggerDirective; content: BrnTabsContentDirective } }>({});
	public readonly $tabs = this._tabs.asReadonly();

	public registerTrigger(key: string, trigger: BrnTabsTriggerDirective) {
		this._tabs.update((tabs) => ({ ...tabs, [key]: { trigger, content: tabs[key]?.content } }));
	}

	public registerContent(key: string, content: BrnTabsContentDirective) {
		this._tabs.update((tabs) => ({ ...tabs, [key]: { trigger: tabs[key]?.trigger, content } }));
	}

	emitTabActivated(key: string) {
		this.tabActivated.emit(key);
	}

	setActiveTab(key: string) {
		this._activeTab.set(key);
	}
}
