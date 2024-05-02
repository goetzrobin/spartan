import { Directive, Input, booleanAttribute, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const badgeVariants = cva(
	'inline-flex items-center border rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'bg-primary border-transparent text-primary-foreground',
				secondary: 'bg-secondary border-transparent text-secondary-foreground',
				destructive: 'bg-destructive border-transparent text-destructive-foreground',
				outline: 'text-foreground border-border',
			},
			size: {
				default: 'text-xs',
				lg: 'text-sm',
			},
			static: { true: '', false: '' },
		},
		compoundVariants: [
			{
				variant: 'default',
				static: false,
				class: 'hover:bg-primary/80',
			},
			{
				variant: 'secondary',
				static: false,
				class: 'hover:bg-secondary/80',
			},
			{
				variant: 'destructive',
				static: false,
				class: 'hover:bg-destructive/80',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'default',
			static: false,
		},
	},
);
type badgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
	selector: '[hlmBadge]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBadgeDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(badgeVariants({ variant: this._variant(), size: this._size(), static: this._static() }), this.userClass()),
	);

	private readonly _variant = signal<badgeVariants['variant']>('default');
	@Input()
	set variant(variant: badgeVariants['variant']) {
		this._variant.set(variant);
	}

	private readonly _static = signal<badgeVariants['static']>(false);
	@Input({ transform: booleanAttribute })
	set static(value: badgeVariants['static']) {
		this._static.set(value);
	}

	private readonly _size = signal<badgeVariants['size']>('default');
	@Input()
	set size(size: badgeVariants['size']) {
		this._size.set(size);
	}
}
