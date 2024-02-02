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
		<a
			[class]="_computedClass()"
			hlmPaginationLink
			[link]="link()"
			size="default"
			[attr.aria-label]="'Go to next page'"
		>
			<span>Next</span>
			<hlm-icon size="sm" name="radixChevronRight" />
		</a>
	`,
})
export class HlmPaginationNextComponent {
	public readonly class = input('');
	public readonly link = input<string | any[] | null | undefined>();

	protected _computedClass = computed(() => hlm('gap-1 pr-2.5', this.class()));
}
