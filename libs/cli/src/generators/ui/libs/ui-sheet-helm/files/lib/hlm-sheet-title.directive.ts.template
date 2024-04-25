import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSheetTitleDirective } from '@spartan-ng/ui-sheet-brain';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnSheetTitleDirective],
})
export class HlmSheetTitleDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('text-lg font-semibold', this.userClass()));
}
