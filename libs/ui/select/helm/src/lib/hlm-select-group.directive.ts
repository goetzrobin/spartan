import { Directive, computed, input } from '@angular/core';
import { BrnSelectGroupDirective } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectGroup], hlm-select-group',
	hostDirectives: [BrnSelectGroupDirective],
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectGroupDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(this.userClass()));
}
