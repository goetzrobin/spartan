import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlm][brnCmdItem],[hlm][cmdkItem]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandItemDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this.generateClass());
	generateClass() {
		return hlm(
			'flex items-center relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none\n' +
				'aria-selected:bg-accent aria-selected:text-accent-foreground\n' +
				'hover:bg-accent/50\n' +
				'disabled:pointer-events-none disabled:opacity-50',
			this._userCls(),
		);
	}
}
