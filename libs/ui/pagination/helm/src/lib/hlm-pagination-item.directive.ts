import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';

export const paginationItemVariants = cva('', {
	variants: {},
	defaultVariants: {},
});
export type PaginationItemVariants = VariantProps<typeof paginationItemVariants>;

@Directive({
	selector: '[hlmPaginationItem]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationItemDirective {
	public readonly class = input('');

	protected _computedClass = computed(() => hlm(paginationItemVariants(), this.class()));
}
