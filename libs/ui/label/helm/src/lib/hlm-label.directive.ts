import { isPlatformBrowser } from '@angular/common';
import { computed, Directive, ElementRef, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const labelVariants = cva(
	'text-sm font-medium leading-none [&:has([hlmInput]:disabled)]:cursor-not-allowed [&:has([hlmInput]:disabled)]:opacity-70',
	{
		variants: {
			variant: {
				default: '',
			},
			error: {
				auto: '[&:has([hlmInput].ng-invalid.ng-touched)]:text-destructive',
				true: 'text-destructive',
			},
			disabled: {
				auto: '[&:has([hlmInput]:disabled)]:opacity-70',
				true: 'opacity-70',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			error: 'auto',
		},
	},
);
export type LabelVariants = VariantProps<typeof labelVariants>;

@Directive({
	selector: '[hlmLabel]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLabelDirective implements OnInit {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _element = inject(ElementRef).nativeElement;
	private _changes?: MutationObserver;
	private readonly _dataDisabled = signal<boolean | 'auto'>('auto');

	ngOnInit(): void {
		if (!this._isBrowser) return;
		this._changes = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((mutation: MutationRecord) => {
				if (mutation.attributeName !== 'data-disabled') return;
				// eslint-disable-next-line
				const state = (mutation.target as any).attributes.getNamedItem(mutation.attributeName)?.value === 'true';
				this._dataDisabled.set(state ?? 'auto');
			});
		});
		this._changes?.observe(this._element, {
			attributes: true,
			childList: true,
			characterData: true,
		});
	}
	private readonly _variant = signal<LabelVariants['variant']>('default');
	@Input()
	set variant(value: LabelVariants['variant']) {
		this._variant.set(value);
	}

	private readonly _error = signal<LabelVariants['error']>('auto');
	@Input()
	set error(value: LabelVariants['error']) {
		this._error.set(value);
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected readonly _computedClass = computed(() =>
		hlm(
			labelVariants({ variant: this._variant(), error: this._error(), disabled: this._dataDisabled() }),
			this._userCls(),
		),
	);
}
