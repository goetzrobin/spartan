import { booleanAttribute, Component, computed, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-label',
	standalone: true,
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuLabelComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	private readonly _inset = signal<ClassValue>(false);
	@Input({ transform: booleanAttribute })
	set inset(value: boolean) {
		this._inset.set(value);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('block px-2 py-1.5 text-sm font-semibold', this._inset() && 'pl-10', this._userCls());
	}
}
