import { Directive, computed, inject, input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'button[hlmAlertDialogCancel]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAlertDialogCancelButtonDirective {
	private readonly _hlmBtn = inject(HlmButtonDirective, { host: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('mt-2 sm:mt-0', this.userClass()));

	constructor() {
		this._hlmBtn.variant = 'outline';
	}
}
