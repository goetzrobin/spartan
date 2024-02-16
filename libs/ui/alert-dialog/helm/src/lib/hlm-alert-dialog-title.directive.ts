import { computed, Directive, input } from '@angular/core';
import { BrnAlertDialogTitleDirective } from '@spartan-ng/ui-alertdialog-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAlertDialogTitleDirective],
})
export class HlmAlertDialogTitleDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('text-lg font-semibold', this._userClass()));
}
