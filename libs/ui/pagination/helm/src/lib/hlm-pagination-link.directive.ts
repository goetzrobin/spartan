import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { type VariantProps, cva } from 'class-variance-authority';

export const paginationLinkVariants = cva('', {
	variants: {},
	defaultVariants: {},
});
export type PaginationLinkVariants = VariantProps<typeof paginationLinkVariants>;

@Directive({
	selector: '[hlmPaginationLink]',
	standalone: true,
	hostDirectives: [
		{
			directive: RouterLink,
			inputs: [
				'target',
				'queryParams',
				'fragment',
				'queryParamsHandling',
				'state',
				'info',
				'relativeTo',
				'preserveFragment',
				'skipLocationChange',
				'replaceUrl',
				'routerLink: link',
			],
		},
	],
	host: {
		'[class]': '_computedClass()',
		'[attr.aria-current]': 'isActive() ? "page" : null',
	},
})
export class HlmPaginationLinkDirective {
	public readonly class = input('');
	public readonly isActive = input(false, { transform: booleanAttribute });
	public readonly size = input<ButtonVariants['size']>('icon');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly link = input<string | any[] | null | undefined>();

	protected _computedClass = computed(() =>
		hlm(
			paginationLinkVariants(),
			buttonVariants({
				variant: this.isActive() ? 'outline' : 'ghost',
				size: this.size(),
			}),
			this.class(),
		),
	);
}
