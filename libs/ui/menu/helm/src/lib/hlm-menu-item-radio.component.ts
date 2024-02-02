import { Component, computed, input } from '@angular/core';
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
		<hlm-icon size="none" class="h-full w-full" name="radixDotFilled" />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuItemRadioComponent {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('group-[.checked]:opacity-100 opacity-0 inline-block mr-2 h-5 w-5', this._userClass()),
	);
}
