import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { AfterViewInit, computed, Directive, ElementRef, inject, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const parseDividedString = (value: NumberInput): NumberInput => {
	if (typeof value !== 'string' || !value.includes('/')) return value;
	return value
		.split('/')
		.map((v) => parseInt(v, 10))
		.reduce((a, b) => a / b);
};

@Directive({
	selector: '[hlmAspectRatio]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[style.padding-bottom]': '_computedPaddingBottom()',
	},
})
export class HlmAspectRatioDirective implements AfterViewInit {
	private readonly _ratio = signal(1);
	private readonly _el: HTMLElement = inject(ElementRef).nativeElement;

	protected readonly _computedPaddingBottom = computed(() => {
		return `${100 / this._ratio()}%`;
	});

	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() => hlm(`relative w-full`, this._userCls()));

	@Input()
	set hlmAspectRatio(value: NumberInput) {
		const coerced = coerceNumberProperty(parseDividedString(value));
		this._ratio.set(coerced <= 0 ? 1 : coerced);
	}

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	ngAfterViewInit() {
		// support delayed addition of image to dom
		const child = this._el.firstElementChild;
		if (child) {
			child.classList.add('absolute', 'w-full', 'h-full', 'object-cover');
		}
	}
}
