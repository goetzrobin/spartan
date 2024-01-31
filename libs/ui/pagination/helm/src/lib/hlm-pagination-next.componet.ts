import { Component, computed, input } from '@angular/core';
import { radixChevronRight } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-next',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ radixChevronRight })],
	template: `
		<!-- TODO decide how to pass href/routerLink -->
		<a class="gap-1 pr-2.5" hlmPaginationLink size="default" [attr.aria-label]="'Go to next page'">
			<span>Next</span>
			<hlm-icon size="sm" name="radixChevronRight" />
		</a>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationNextComponent {
	public readonly class = input('');

	protected _computedClass = computed(() => hlm('', this.class()));
}
