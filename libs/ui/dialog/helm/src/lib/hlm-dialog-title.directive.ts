import { Directive, computed, input } from '@angular/core';
import { BrnDialogTitleDirective } from '@spartan-ng/brain/dialog';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnDialogTitleDirective],
})
export class HlmDialogTitleDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('text-lg font-semibold leading-none tracking-tight', this.userClass()));
}
