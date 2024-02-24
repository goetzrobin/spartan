import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnMenuItemDirective } from '@spartan-ng/ui-menu-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuBarItem]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnMenuItemDirective],
})
export class HlmMenuBarItemDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
			this._userClass(),
		),
	);
}
