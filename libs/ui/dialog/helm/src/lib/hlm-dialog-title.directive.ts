import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogTitle],[brnDialogTitle][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmDialogTitleDirective {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	private generateClass() {
		return hlm('text-lg font-semibold leading-none tracking-tight', this._userCls());
	}
}
