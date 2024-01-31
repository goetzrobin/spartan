import { Component, computed, input } from '@angular/core';
import { radixDotsHorizontal } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-ellipsis',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ radixDotsHorizontal })],
	template: `
		<span class="flex h-9 w-9 items-center justify-center">
			<hlm-icon size="sm" name="radixDotsHorizontal" />
			<span class="sr-only">More pages</span>
		</span>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationEllipsisComponent {
	public readonly class = input('');

	protected _computedClass = computed(() => hlm('', this.class()));
}
