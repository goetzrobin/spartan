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
	private _userCls = signal<ClassValue>('');
	private _inset = signal<ClassValue>(false);
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	@Input({ transform: booleanAttribute })
	set inset(value: boolean) {
		this._inset.set(value);
	}

	generateClass() {
		return hlm('block px-2 py-1.5 text-sm font-semibold', this._inset() && 'pl-10', this._userCls());
	}
}
