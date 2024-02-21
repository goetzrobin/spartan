import { computed, Directive, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectValueDirective {
	private readonly classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this.classNames.set(classNames);
	}
	protected readonly _computedClass = computed(() =>
		hlm(
			'!inline-block ltr:text-left rtl:text-right border-border w-[calc(100%)]] min-w-0 pointer-events-none truncate',
			this.classNames(),
		),
	);
}
