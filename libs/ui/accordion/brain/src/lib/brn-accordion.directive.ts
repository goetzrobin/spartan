import { FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import {
	AfterContentInit,
	ContentChildren,
	Directive,
	ElementRef,
	Input,
	NgZone,
	OnDestroy,
	QueryList,
	computed,
	inject,
	signal,
} from '@angular/core';
import { BrnAccordionTriggerDirective } from './brn-accordion-trigger.directive';

const HORIZONTAL_KEYS_TO_PREVENT_DEFAULT = [
	'ArrowLeft',
	'ArrowRight',
	'PageDown',
	'PageUp',
	'Home',
	'End',
	' ',
	'Enter',
];
const VERTICAL_KEYS_TO_PREVENT_DEFAULT = ['ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Enter'];

@Directive({
	selector: '[brnAccordion]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.data-orientation]': 'orientation',
	},
})
export class BrnAccordionDirective implements AfterContentInit, OnDestroy {
	private readonly _el = inject(ElementRef);
	private _keyManager?: FocusKeyManager<BrnAccordionTriggerDirective>;
	private _focusMonitor = inject(FocusMonitor);
	private _ngZone = inject(NgZone);

	private readonly _focused = signal<boolean>(false);
	private readonly _openItemIds = signal<number[]>([]);
	public readonly openItemIds = this._openItemIds.asReadonly();
	public readonly state = computed(() => (this._openItemIds().length > 0 ? 'open' : 'closed'));

	@ContentChildren(BrnAccordionTriggerDirective, { descendants: true })
	public triggers?: QueryList<BrnAccordionTriggerDirective>;

	@Input()
	public type: 'single' | 'multiple' = 'single';
	@Input()
	public dir: 'ltr' | 'rtl' | null = null;
	@Input()
	public orientation: 'horizontal' | 'vertical' = 'vertical';

	public ngAfterContentInit() {
		if (!this.triggers) {
			return;
		}
		this._keyManager = new FocusKeyManager<BrnAccordionTriggerDirective>(this.triggers)
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap();

		if (this.orientation === 'horizontal') {
			this._keyManager.withHorizontalOrientation(this.dir ?? 'ltr').withVerticalOrientation(false);
		}
		this._el.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
			this._keyManager?.onKeydown(event as KeyboardEvent);
			this.preventDefaultEvents(event as KeyboardEvent);
		});
		this._focusMonitor.monitor(this._el, true).subscribe((origin) => this._focused.set(origin !== null));
	}

	ngOnDestroy(): void {
		this._focusMonitor.stopMonitoring(this._el);
	}

	public setActiveItem(item: BrnAccordionTriggerDirective) {
		// public setActiveItem(item: number) {
		this._keyManager?.setActiveItem(item);
	}

	public toggleItem(id: number) {
		if (this._openItemIds().includes(id)) {
			this.closeItem(id);
			return;
		}
		this.openItem(id);
	}

	public openItem(id: number) {
		if (this.type === 'single') {
			this._openItemIds.set([id]);
			return;
		}
		this._openItemIds.update((ids) => [...ids, id]);
	}
	public closeItem(id: number) {
		this._openItemIds.update((ids) => ids.filter((openId) => id !== openId));
	}

	private preventDefaultEvents(event: KeyboardEvent) {
		if (!this._focused()) return;
		if (!('key' in event)) return;

		const keys =
			this.orientation === 'horizontal' ? HORIZONTAL_KEYS_TO_PREVENT_DEFAULT : VERTICAL_KEYS_TO_PREVENT_DEFAULT;
		if (keys.includes(event.key as string) && event.code !== 'NumpadEnter') {
			event.preventDefault();
		}
	}
}
