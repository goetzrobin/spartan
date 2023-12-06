import { Component, computed, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnMenuBarDirective } from '@spartan-ng/ui-menu-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-bar',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnMenuBarDirective],
	template: '<ng-content/>',
})
export class HlmMenuBarComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('border-border flex h-10 items-center space-x-1 rounded-md border bg-background p-1', this._userCls());
	}
}
