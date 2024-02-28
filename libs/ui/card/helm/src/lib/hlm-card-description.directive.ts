import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const cardDescriptionVariants = cva('text-sm text-muted-foreground', {
	variants: {},
	defaultVariants: {},
});
export type CardDescriptionVariants = VariantProps<typeof cardDescriptionVariants>;

@Directive({
	selector: '[hlmCardDescription]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardDescriptionDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(cardDescriptionVariants(), this.userClass()));
}
