import { FocusKeyManager } from '@angular/cdk/a11y';
import {
	AfterContentInit,
	computed,
	ContentChildren,
	Directive,
	ElementRef,
	inject,
	Input,
	QueryList,
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
export class BrnAccordionDirective implements AfterContentInit {
	private readonly _el = inject(ElementRef);
	private _keyManager?: FocusKeyManager<BrnAccordionTriggerDirective>;

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
	}

	public setActiveItem(id: number) {
		this._keyManager?.setActiveItem(id);
	}

	public toggleItem(id: number) {
		if (this._openItemIds().includes(id)) {
			this._openItemIds.update((ids) => ids.filter((openId) => id !== openId));
			return;
		} else if (this.type === 'single') {
			this._openItemIds.set([]);
		}
		this._openItemIds.update((ids) => [...ids, id]);
	}

	private preventDefaultEvents(event: KeyboardEvent) {
		for (const trigger of this.triggers?.toArray() ?? []) {
			if (trigger.id !== document.activeElement?.id) return;
			if (!('key' in event)) return;

			const keys =
				this.orientation === 'horizontal' ? HORIZONTAL_KEYS_TO_PREVENT_DEFAULT : VERTICAL_KEYS_TO_PREVENT_DEFAULT;
			if (keys.includes(event.key as string)) {
				event.preventDefault();
			}
		}
	}
}
