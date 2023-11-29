import { Directive, Input, computed, signal } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionTrigger],brn-accordion-trigger[hlm]',
	standalone: true,
	host: {
		'[style.--tw-ring-offset-shadow]': '"0 0 #000"',
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionTriggerDirective {
	private _host = injectCustomClassSettable({ optional: true });

	constructor() {
		this._host?.setClassToCustomElement(this._generateClass());
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
		// cannot set in effect because it sets a signal
		if (this._host) {
			this._host.setClassToCustomElement(this._generateClass());
		}
	}

	protected _computedClass = computed(() => {
		return !this._host ? this._generateClass() : '';
	});
	private _generateClass() {
		return hlm(
			'w-full focus-visible:outline-none text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-1 items-center justify-between py-4 px-0.5 font-medium underline-offset-4 hover:underline [&[data-state=open]>hlm-accordion-icon]:rotate-180',
			this._userCls(),
		);
	}
}
