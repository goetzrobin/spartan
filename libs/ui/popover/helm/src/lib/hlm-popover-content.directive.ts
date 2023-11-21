import { computed, Directive, effect, ElementRef, inject, Input, Renderer2, signal } from '@angular/core';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmPopoverContent],[brnPopoverContent][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPopoverContentDirective {
	private _stateProvider = injectExposesStateProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed');
	private _renderer = inject(Renderer2);
	private _element = inject(ElementRef);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'relative border-border w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this._userCls(),
		);
	}
}
