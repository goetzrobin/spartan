import { computed, Directive, Input, signal } from '@angular/core';
import { BrnAlertDialogDescriptionDirective } from '@spartan-ng/ui-alertdialog-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogDescription]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAlertDialogDescriptionDirective],
})
export class HlmAlertDialogDescriptionDirective {
	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() => hlm('text-sm text-muted-foreground', this._userCls()));

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
