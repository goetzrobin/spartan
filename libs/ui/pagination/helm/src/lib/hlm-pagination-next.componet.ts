import { Component, computed, input } from '@angular/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-next',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<a
			[class]="_computedClass()"
			hlmPaginationLink
			[link]="link()"
			size="default"
			[attr.aria-label]="'Go to next page'"
		>
			<span>Next</span>
			<hlm-icon size="sm" name="lucideChevronRight" />
		</a>
	`,
})
export class HlmPaginationNextComponent {
	public readonly class = input('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public readonly link = input<string | any[] | null | undefined>();

	protected _computedClass = computed(() => hlm('gap-1 pr-2.5', this.class()));
}
