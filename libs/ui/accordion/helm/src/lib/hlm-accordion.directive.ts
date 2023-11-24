import { Directive, Input, computed, inject, signal } from '@angular/core';
import { BrnAccordionDirective } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordion]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAccordionDirective],
})
export class HlmAccordionDirective {
	private _brn = inject(BrnAccordionDirective);
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		if (this._brn.orientation === 'horizontal') {
			return hlm('flex flex-row ', this._userCls());
		}
		return hlm('flex flex-col ', this._userCls());
	}
}
