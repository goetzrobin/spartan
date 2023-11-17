import { Component, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-accordion-icon',
	standalone: true,
	template: `
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	`,
	host: {
		'[class]': 'generatedClasses()',
	},
})
export class HlmAccordionIconComponent {
	private _userCls = signal<ClassValue>('');

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected generatedClasses = computed(() => {
		return hlm('inline-block h-4 w-4 transition-transform duration-200', this._userCls());
	});
}
