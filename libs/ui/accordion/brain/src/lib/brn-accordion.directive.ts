import { FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
	type AfterContentInit,
	ContentChildren,
	Directive,
	ElementRef,
	HostListener,
	Input,
	NgZone,
	type OnDestroy,
	type QueryList,
	computed,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
	selector: '[brnAccordionItem]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
	},
})
export class BrnAccordionItemDirective {
	private static itemIdGenerator = 0;
	private readonly _accordion = inject(BrnAccordionDirective);
	public readonly isOpened = input(false, { transform: coerceBooleanProperty });

	public readonly id = BrnAccordionItemDirective.itemIdGenerator++;
	public readonly state = computed(() => (this._accordion.openItemIds().includes(this.id) ? 'open' : 'closed'));

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}
		effect(() => {
			const isOpened = this.isOpened();
			untracked(() => {
				if (isOpened) {
					this._accordion.openItem(this.id);
				} else {
					this._accordion.closeItem(this.id);
				}
			});
		});
	}
}

@Directive({
	selector: '[brnAccordionTrigger]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-expanded]': 'state() === "open"',
		'[attr.aria-controls]': 'ariaControls',
		role: 'heading',
		'aria-level': '3',
		'[id]': 'id',
	},
})
export class BrnAccordionTriggerDirective {
	private readonly _accordion = inject(BrnAccordionDirective);
	private readonly _item = inject(BrnAccordionItemDirective);
	private readonly _elementRef = inject(ElementRef);

	public readonly state = this._item.state;
	public readonly id = `brn-accordion-trigger-${this._item.id}`;
	public readonly ariaControls = `brn-accordion-content-${this._item.id}`;

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}

		if (!this._item) {
			throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}

		fromEvent(this._elementRef.nativeElement, 'focus')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this._accordion.setActiveItem(this);
			});
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.space', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	protected toggle(event: Event): void {
		event.preventDefault();
		this._accordion.toggleItem(this._item.id);
	}

	public focus() {
		this._elementRef.nativeElement.focus();
	}
}

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
