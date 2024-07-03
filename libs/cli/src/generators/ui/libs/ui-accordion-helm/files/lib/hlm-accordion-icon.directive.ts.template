import { Directive, computed, inject, input } from '@angular/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-icon[hlmAccordionIcon], hlm-icon[hlmAccIcon]',
	standalone: true,
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionIconDirective {
	private readonly _hlmIcon = inject(HlmIconComponent);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('inline-block h-4 w-4 transition-transform [animation-duration:200]', this.userClass()),
	);

	constructor() {
		this._hlmIcon.size = 'none';
		this._hlmIcon.name = 'lucideChevronDown';
	}
}
