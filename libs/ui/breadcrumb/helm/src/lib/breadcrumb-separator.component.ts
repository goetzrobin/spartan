import { Component, computed, input } from '@angular/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-breadcrumb-separator',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
      	<ng-content>	
			<hlm-icon name="lucideChevronRight" class="h-3.5 w-3.5" />
		</ng-content>
  	`,
})
export class HlmBreadcrumbSeparatorComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('h-3.5', this.userClass()));
}
