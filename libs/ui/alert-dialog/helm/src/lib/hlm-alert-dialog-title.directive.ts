import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogTitle],[brnAlertDialogTitle][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogTitleDirective {
	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this.generateClass());
	private generateClass() {
		return hlm('text-lg font-semibold', this._userCls());
	}
}
