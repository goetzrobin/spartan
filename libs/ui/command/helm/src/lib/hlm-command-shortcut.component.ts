import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-cmd-shortcut',
	standalone: true,
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandShortcutComponent {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('ml-auto font-light text-xs tracking-widest opacity-60', this._userClass()),
	);
}
