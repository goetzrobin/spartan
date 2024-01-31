import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { radixChevronLeft } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-previous',
	standalone: true,
	imports: [RouterLink, HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ radixChevronLeft })],
	template: `
		<a
			class="gap-1 pr-2.5"
			hlmPaginationLink
			size="default"
			[attr.aria-label]="'Go to previous page'"
			[routerLink]="href()"
		>
			<hlm-icon size="sm" name="radixChevronLeft" />
			<span>Previous</span>
		</a>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationPreviousComponent {
	public readonly class = input('');
	public readonly href = input<string | any[] | null | undefined>();

	protected _computedClass = computed(() => hlm('', this.class()));
}
