import { computed, Directive, inject, Input, signal } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCmdDialogCloseBtn]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDialogCloseButtonDirective {
	private _hlmBtn = inject(HlmButtonDirective, { host: true });
	constructor() {
		this._hlmBtn.variant = 'ghost';
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('!p-1 !h-5 !w-5', this._userCls());
	}
}
