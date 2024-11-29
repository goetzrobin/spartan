import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';
import { HlmPaginationLinkDirective } from './hlm-pagination-link.directive';

@Component({
	selector: 'hlm-pagination-previous',
	standalone: true,
	imports: [HlmPaginationLinkDirective, HlmIconComponent],
	providers: [provideIcons({ lucideChevronLeft })],
	template: `
		<a [class]="_computedClass()" hlmPaginationLink [link]="link()" size="default" [attr.aria-label]="ariaLabel()">
			<hlm-icon size="sm" name="lucideChevronLeft" />
			<span>{{ text() }}</span>
		</a>
	`,
})
export class HlmPaginationPreviousComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly link = input<RouterLink['routerLink']>();

	public readonly ariaLabel = input<string>('Go to previous page', { alias: 'aria-label' });
	public readonly text = input<string>('Previous');

	protected readonly _computedClass = computed(() => hlm('gap-1 pl-2.5', this.userClass()));
}
