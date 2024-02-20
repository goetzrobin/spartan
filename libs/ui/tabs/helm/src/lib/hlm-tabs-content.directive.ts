import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsContentDirective } from '@spartan-ng/ui-tabs-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsContent]',
	standalone: true,
	hostDirectives: [{ directive: BrnTabsContentDirective, inputs: ['brnTabsContent: hlmTabsContent'] }],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsContentDirective {
	public readonly contentFor = input.required<string>({ alias: 'hlmTabsContent' });

	public readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			this._userClass(),
		),
	);
}
