import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';

export const paginationContentVariants = cva('flex flex-row items-center gap-1', {
	variants: {},
	defaultVariants: {},
});
export type PaginationContentVariants = VariantProps<typeof paginationContentVariants>;

@Directive({
	selector: '[hlmPaginationContent]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationContentDirective {
	public readonly class = input('');
	protected readonly _computedClass = computed(() => hlm(paginationContentVariants(), this.class()));
}
