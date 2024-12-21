import { Directive, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ng-icon[hlmAccordionIcon], ng-icon[hlmAccIcon]',
	standalone: true,
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		'[class]': '_computedClass()',
		'[style.--ng-icon__size.px]': '16',
	},
})
export class HlmAccordionIconDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('inline-block transition-transform [animation-duration:200]', this.userClass()),
	);
}
