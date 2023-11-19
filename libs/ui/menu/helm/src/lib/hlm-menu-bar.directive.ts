import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlm][brnMenuBar]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuBarDirective {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	generateClass() {
		return hlm('border-border flex h-10 items-center space-x-1 rounded-md border bg-background p-1', this._userCls());
	}
}
