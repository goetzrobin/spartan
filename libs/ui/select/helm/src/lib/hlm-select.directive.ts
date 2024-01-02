import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-select, brn-select [hlm]',
	standalone: true,
})
export class HlmSelectDirective {
	constructor() {
		console.log('boom');
	}

	baseClasses = '';

	private readonly classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this.classNames.set(classNames);
	}

	protected _computedClass = computed(() => this._generateClass());

	private _generateClass() {
		return hlm(this.baseClasses, this.classNames());
	}
}
