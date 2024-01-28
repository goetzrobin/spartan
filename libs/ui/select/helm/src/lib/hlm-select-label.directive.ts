import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSelectLabelDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectLabel], hlm-select-label',
	hostDirectives: [BrnSelectLabelDirective],
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectLabelDirective {
	baseClasses = 'px-2 py-1.5 text-sm font-semibold';

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
