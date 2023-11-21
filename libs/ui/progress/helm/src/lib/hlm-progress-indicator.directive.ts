import { computed, Directive, DoCheck, effect, ElementRef, inject, Input, Renderer2, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmProgressIndicator],brn-progress-indicator[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmProgressIndicatorDirective implements DoCheck {
	private _element = inject(ElementRef);
	private _renderer = inject(Renderer2);
	private readonly _value = signal(0);

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('inline-flex transform-gpu h-full w-full flex-1 bg-primary transition-all', this._userCls());
	}

	constructor() {
		effect(() => {
			// using renderer directly as hostbinding is one change detection cycle behind
			const currentValue = this._value();
			this._renderer.setStyle(this._element.nativeElement, 'transform', `translateX(-${100 - (currentValue || 100)}%)`);
			if (!currentValue) {
				this._renderer.addClass(this._element.nativeElement, 'animate-indeterminate');
			} else {
				this._renderer.removeClass(this._element.nativeElement, 'animate-indeterminate');
			}
		});
	}

	ngDoCheck(): void {
		this._value.set(this._element.nativeElement.getAttribute('data-value'));
	}
}
