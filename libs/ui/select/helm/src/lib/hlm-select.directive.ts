import { computed, Directive, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-select, brn-select [hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectDirective {
	private readonly _classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this._classNames.set(classNames);
	}
	protected readonly _computedClass = computed(() => hlm('', this._classNames()));
}
