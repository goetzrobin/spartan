import { Component, Input, computed, signal } from '@angular/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-check',
	standalone: true,
	providers: [provideIcons({ radixCheck })],
	imports: [HlmIconComponent],
	template: `
		<hlm-icon size="none" class="h-full w-full" name="radixCheck" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemCheckComponent {
	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this.generateClass());
	generateClass() {
		return hlm('group-[.checked]:opacity-100 opacity-0 inline-block mr-2 h-5 w-5', this._userCls());
	}
}
