import { Directive, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuIcon]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemIconDirective {
	private _menuIcon = inject(HlmIconComponent, { host: true, optional: true });

	constructor() {
		if (!this._menuIcon) return;
		this._menuIcon.size = 'none';
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('mr-2 h-4 w-4', this.userClass()));
}
