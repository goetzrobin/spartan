import { Directive, Input, computed, signal } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetOverlay],brn-sheet-overlay[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSheetOverlayDirective {
	private _classSettable = injectCustomClassSettable({ optional: true, host: true });

	constructor() {
		this._classSettable?.setClassToCustomElement(this._computedClass());
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
		this._classSettable?.setClassToCustomElement(this._computedClass());
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			this._userCls(),
		);
	}
}
