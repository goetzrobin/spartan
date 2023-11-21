import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-toggle-group[hlm],[hlmToggleGroup]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmToggleGroupDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'inline-flex items-center rounded-md [&>[hlm][brnToggle][variant="outline"]]:-mx-[0.5px] [&>[hlm][brnToggle]]:rounded-none focus:[&>[hlm][brnToggle]]:z-10 first-of-type:[&>[hlm][brnToggle]]:rounded-l-md last-of-type:[&>[hlm][brnToggle]]:rounded-r-md',
			this._userCls(),
		);
	}
}
