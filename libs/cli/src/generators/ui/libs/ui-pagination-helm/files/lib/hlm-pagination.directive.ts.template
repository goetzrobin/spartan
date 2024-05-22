import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

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
		'[attr.role]': '"navigation"',
		'[attr.aria-label]': '"pagination"',
	},
})
export class HlmPaginationDirective {
	public readonly class = input<ClassValue>('');

	protected _computedClass = computed(() => hlm(paginationVariants(), this.class()));
}
