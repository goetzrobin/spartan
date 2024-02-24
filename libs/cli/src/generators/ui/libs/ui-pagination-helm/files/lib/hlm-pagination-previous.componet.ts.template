import { Component, computed, input } from '@angular/core';
import { radixChevronLeft } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-previous',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ radixChevronLeft })],
	template: `
		<a
			[class]="_computedClass()"
			hlmPaginationLink
			[link]="link()"
			size="default"
			[attr.aria-label]="'Go to previous page'"
		>
			<hlm-icon size="sm" name="radixChevronLeft" />
			<span>Previous</span>
		</a>
	`,
})
export class HlmPaginationPreviousComponent {
	public readonly class = input('');
	public readonly link = input<string | any[] | null | undefined>();

	protected _computedClass = computed(() => hlm('gap-1 pr-2.5', this.class()));
}
