import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export const hlmLead = 'text-xl text-muted-foreground';

@Directive({
	selector: '[hlmLead]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLeadDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmLead, this.userClass()));
}
