import { computed, Directive, effect, Input, signal } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogOverlay],brn-dialog-overlay[hlm]',
	standalone: true,
})
export class HlmDialogOverlayDirective {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });

	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			this._userCls(),
		),
	);
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	constructor() {
		effect(() => this._classSettable?.setClassToCustomElement(this._computedClass()));
	}
}
