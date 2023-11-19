import { isPlatformBrowser } from '@angular/common';
import {
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	Injector,
	Input,
	OnInit,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
	standalone: true,
	host: {
		'[style.height]': 'cssHeight()',
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionContentDirective implements OnInit {
	private readonly _host = injectCustomClassSettable({ optional: true });
	private readonly _element = inject(ElementRef).nativeElement;
	private readonly _injector = inject(Injector);
	private readonly _platformId = inject(PLATFORM_ID);

	private _changes?: MutationObserver;

	public readonly height = signal('-1');
	public readonly cssHeight = computed(() => (this.height() === '-1' ? 'auto' : this.height()));
	public readonly state = signal('closed');

	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => {
		return hlm('overflow-hidden text-sm transition-all', this._userCls());
	});

	public ngOnInit() {
		this._host?.setClassToCustomElement('pt-1 pb-4');

		if (isPlatformBrowser(this._platformId)) {
			this._changes = new MutationObserver((mutations: MutationRecord[]) => {
				mutations.forEach((mutation: MutationRecord) => {
					if (mutation.attributeName !== 'data-state') return;
					// eslint-disable-next-line
					const state = (mutation.target as any).attributes.getNamedItem(mutation.attributeName)?.value;
					this.state.set(state);
				});
			});
		}

		Promise.resolve().then(() => {
			this._changes?.observe(this._element, {
				attributes: true,
				childList: true,
				characterData: true,
			});
		});

		effect(
			() => {
				const isOpen = this.state() === 'open';
				Promise.resolve().then(() => {
					this.height.set(
						isOpen ? getComputedStyle(this._element).getPropertyValue('--brn-collapsible-content-height') : '0px',
					);
				});
			},
			{
				injector: this._injector,
				allowSignalWrites: true,
			},
		);
	}
}
