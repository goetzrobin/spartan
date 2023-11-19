import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-radio-group[hlm],[hlmRadioGroup]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioGroupDirective {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	generateClass() {
		return hlm('block', this._userCls());
	}
}
