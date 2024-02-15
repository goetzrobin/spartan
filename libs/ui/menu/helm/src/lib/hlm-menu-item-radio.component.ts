import { Component, computed, Input, signal } from '@angular/core';
import { radixDotFilled } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-item-radio',
	standalone: true,
	providers: [provideIcons({ radixDotFilled })],
	imports: [HlmIconComponent],
	template: `
		<!-- Using 1rem for size to mimick h-4 w-4 -->
		<hlm-icon size="1rem" class="*:*:fill-current" name="radixDotFilled" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemRadioComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'group-[.checked]:opacity-100 opacity-0 absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
			this._userCls(),
		);
	}
}
