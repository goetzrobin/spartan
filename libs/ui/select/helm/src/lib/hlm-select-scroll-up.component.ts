import { Component } from '@angular/core';
import { radixChevronUp } from '@ng-icons/radix-icons';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'hlm-select-scroll-up',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ radixChevronUp })],
	host: {
		class: 'flex cursor-default items-center justify-center py-1',
	},
	template: `
		<hlm-icon class="ml-2 h-4 w-4" name="radixChevronUp" />
	`,
})
export class HlmSelectScrollUpComponent {}
