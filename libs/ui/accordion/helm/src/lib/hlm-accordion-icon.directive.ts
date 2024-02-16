import { computed, Directive, inject, input } from '@angular/core';
import { radixChevronDown } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-icon[hlmAccordionIcon], hlm-icon[hlmAccIcon]',
	standalone: true,
	providers: [provideIcons({ radixChevronDown })],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionIconDirective {
	private readonly _hlmIcon = inject(HlmIconComponent);

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('inline-block h-4 w-4 transition-transform duration-200', this._userClass()),
	);

	constructor() {
		this._hlmIcon.name = 'radixChevronDown';
	}
}
