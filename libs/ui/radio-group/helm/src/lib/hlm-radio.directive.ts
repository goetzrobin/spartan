import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-radio[hlm],[hlmRadio]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioDirective {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	generateClass() {
		return hlm('group [&.brn-radio-disabled]:text-muted-foreground flex items-center space-x-2', this._userCls());
	}
}
