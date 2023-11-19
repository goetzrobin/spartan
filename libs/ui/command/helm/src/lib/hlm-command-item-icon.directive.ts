import { computed, Directive, inject, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCmdIcon]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandItemIconDirective {
	private _menuIcon = inject(HlmIconComponent, { host: true, optional: true });

	constructor() {
		if (!this._menuIcon) return;
		this._menuIcon.size = 'none';
	}
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	generateClass() {
		return hlm('mr-2 h-4 w-4', this._userCls());
	}
}
