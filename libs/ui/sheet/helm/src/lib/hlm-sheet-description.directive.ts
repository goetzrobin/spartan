import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetDescription],[brnSheetDescription][hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSheetDescriptionDirective {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	private generateClass() {
		return hlm('text-sm text-muted-foreground', this._userCls);
	}
}
