import { computed, Directive, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const cardHeaderVariants = cva('flex p-6', {
	variants: {
		direction: {
			row: 'flex-row items-center space-x-1.5',
			column: 'flex-col space-y-1.5',
		},
	},
	defaultVariants: {
		direction: 'column',
	},
});
export type CardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

@Directive({
	selector: '[hlmCardHeader]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardHeaderDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(cardHeaderVariants({ direction: this._direction() }), this._userClass()),
	);

	private readonly _direction = signal<CardHeaderVariants['direction']>('column');
	public readonly direction = input<CardHeaderVariants['direction']>('column');
}
