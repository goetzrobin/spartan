import { Component, computed, input } from '@angular/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-ellipsis',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ lucideMoreHorizontal })],
	template: `
		<span [class]="_computedClass()">
			<hlm-icon size="sm" name="lucideMoreHorizontal" />
			<span class="sr-only">More pages</span>
		</span>
	`,
})
export class HlmPaginationEllipsisComponent {
	public readonly class = input('');

	protected _computedClass = computed(() => hlm('flex h-9 w-9 items-center justify-center', this.class()));
}
