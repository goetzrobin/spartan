import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const alertDescriptionVariants = cva('text-sm [&_p]:leading-relaxed', {
	variants: {},
});
export type AlertDescriptionVariants = VariantProps<typeof alertDescriptionVariants>;

@Directive({
	selector: '[hlmAlertDesc],[hlmAlertDescription]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDescriptionDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(alertDescriptionVariants(), this.userClass()));
}
