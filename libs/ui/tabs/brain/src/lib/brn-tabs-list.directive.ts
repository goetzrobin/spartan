import { FocusKeyManager } from '@angular/cdk/a11y';
import { type AfterContentInit, ContentChildren, Directive, type QueryList, inject } from '@angular/core';
import { rxHostListener } from '@spartan-ng/ui-core';
import { take } from 'rxjs';
import { BrnTabsTriggerDirective } from './brn-tabs-trigger.directive';
import { BrnTabsDirective } from './brn-tabs.directive';

@Directive({
	selector: '[brnTabsList]',
	standalone: true,
	host: {
		role: 'tablist',
		'[attr.aria-orientation]': '_orientation()',
		'[attr.data-orientation]': '_orientation()',
	},
	exportAs: 'brnTabsList',
})
export class BrnTabsListDirective implements AfterContentInit {
	private _root = inject(BrnTabsDirective);

	protected readonly _orientation = this._root.$orientation;
	private readonly _direction = this._root.$direction;
	private readonly _value = this._root.$value;
	private readonly _tabs = this._root.$tabs;
	private readonly _keyDownListener = rxHostListener('keydown');

	private _keyManager?: FocusKeyManager<BrnTabsTriggerDirective>;

	@ContentChildren(BrnTabsTriggerDirective, { descendants: true })
	public triggers?: QueryList<BrnTabsTriggerDirective>;

	public ngAfterContentInit() {
		if (!this.triggers) {
			return;
		}
		this._keyManager = new FocusKeyManager<BrnTabsTriggerDirective>(this.triggers)
			.withHorizontalOrientation(this._direction())
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap();

		// needed because by default the index is set to -1, which means first interaction is skipped
		this._keyDownListener.pipe(take(1)).subscribe(() => {
			const currentKey = this._value();
			let activeIndex = 0;
			if (currentKey && this.triggers) {
				const currentTab = this._tabs[currentKey];
				if (currentTab) {
					activeIndex = this.triggers.toArray().indexOf(currentTab.trigger);
				}
			}
			this._keyManager?.setActiveItem(activeIndex);
		});

		this._keyDownListener.subscribe((event) => {
			if ('key' in event) {
				if (this._orientation() === 'horizontal') {
					if (event.key === 'ArrowUp' || event.key === 'ArrowDown') return;
				}
				if (this._orientation() === 'vertical') {
					if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;
				}
			}
			this._keyManager?.onKeydown(event as KeyboardEvent);
		});
	}
}
