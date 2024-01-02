import { computed, Directive, effect, inject, Input, signal } from '@angular/core';
import { BrnAccordionTriggerComponent } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionTrigger],hlm-accordion-trigger:not(notHlm)',
	standalone: true,
	host: {
		// setting the host class to empty as we don't want our class input to affect the host element
		'[attr.class]': '""',
		'[style.--tw-ring-offset-shadow]': '"0 0 #000"',
	},
})
export class HlmAccordionTriggerDirective {
	private brnAccordionTrigger = inject(BrnAccordionTriggerComponent);
	private readonly _userCls = signal<ClassValue>('');
	private readonly _computedClass = computed(() =>
		hlm(
			'w-full focus-visible:outline-none text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-1 items-center justify-between py-4 px-0.5 font-medium underline-offset-4 hover:underline [&[data-state=open]>[hlmAccordionIcon]]:rotate-180 [&[data-state=open]>[hlmAccIcon]]:rotate-180',
			this._userCls(),
		),
	);

	constructor() {
		this.brnAccordionTrigger.class = this._computedClass();

		effect(() => {
			const computedClass = this._computedClass();
			if (this.brnAccordionTrigger) {
				this.brnAccordionTrigger.class = computedClass;
			}
		});
	}

	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}
}
