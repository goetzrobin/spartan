import { computed, Directive, effect, ElementRef, inject, Input, Renderer2, signal } from '@angular/core';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogContent],[brnDialogContent][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmDialogContentDirective {
	private _statusProvider = injectExposesStateProvider({ host: true });
	public state = this._statusProvider.state ?? signal('closed').asReadonly();
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

	protected _computedClass = computed(() => this.generateClass());

	private generateClass() {
		return hlm(
			'border-border grid w-full max-w-lg relative gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg md:w-full',
			this._userCls(),
		);
	}
}
