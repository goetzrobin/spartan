import { computed, Directive, Input, signal } from '@angular/core';
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
	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() => hlm('text-lg font-semibold', this._userCls()));
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
