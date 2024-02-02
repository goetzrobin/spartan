import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';

export const paginationVariants = cva('mx-auto flex w-full justify-center', {
	variants: {},
	defaultVariants: {},
});
export type PaginationVariants = VariantProps<typeof paginationVariants>;

@Directive({
	selector: '[hlmPagination]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[attr.role]': 'navigation',
		'[attr.aria-label]': 'pagination',
	},
})
export class HlmPaginationDirective {
	public readonly class = input('');

	protected _computedClass = computed(() => hlm(paginationVariants(), this.class()));
}
