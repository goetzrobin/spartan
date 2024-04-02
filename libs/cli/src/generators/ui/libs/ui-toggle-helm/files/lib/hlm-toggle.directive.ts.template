import { computed, Directive, Input, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const toggleVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 px-2',
				lg: 'h-10 px-3',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);
type ToggleVariants = VariantProps<typeof toggleVariants>;

@Directive({
	selector: '[hlmToggle],[brnToggle][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmToggleDirective {
	private readonly _variant = signal<ToggleVariants['variant']>('default');
	@Input()
	set variant(value: ToggleVariants['variant']) {
		this._variant.set(value);
	}

	private readonly _size = signal<ToggleVariants['size']>('default');
	@Input()
	set size(value: ToggleVariants['size']) {
		this._size.set(value);
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(toggleVariants({ variant: this._variant(), size: this._size() }), this.userClass()),
	);
}
