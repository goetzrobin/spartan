import { Component, Input, computed, signal } from '@angular/core';
import { radixChevronRight } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-sub-indicator',
	standalone: true,
	providers: [provideIcons({ radixChevronRight })],
	imports: [HlmIconComponent],
	template: `
		<hlm-icon size="none" class="h-full w-full" name="radixChevronRight" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemSubIndicatorComponent {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	generateClass() {
		return hlm('inline-block ml-auto h-4 w-4', this._userCls());
	}
}
