import { computed, Directive, input, InputSignal, Signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const inputVariants = cva();

@Directive({
	selector: '[hlmInputPrefix]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputPrefixDirective {
	public readonly userClass: InputSignal<ClassValue> = input<ClassValue>('', {
		alias: 'class',
	});
	protected _computedClass: Signal<string> = computed(() => hlm(inputVariants({}), this.userClass()));
}
