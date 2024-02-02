import { computed, Directive, effect, input } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogOverlay],brn-alert-dialog-overlay[hlm]',
	standalone: true,
})
export class HlmAlertDialogOverlayDirective {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			this._userClass(),
		),
	);

	constructor() {
		effect(() => this._classSettable?.setClassToCustomElement(this._computedClass()));
	}
}
