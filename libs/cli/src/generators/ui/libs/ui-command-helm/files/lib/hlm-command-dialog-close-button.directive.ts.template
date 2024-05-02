import { Directive, computed, inject, input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

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

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('!p-1 !h-5 !w-5', this.userClass()));
}
