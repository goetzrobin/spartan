import { Component, computed, input } from '@angular/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/ui-core';

@Component({
   
  selector: 'hlm-breadcrumb-separator',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ lucideChevronRight })],
  host: {
    '[class]': '_computedClass()',
  },
  template: `
    <div #ref>
      <ng-content />
    </div>
    @if (!ref.hasChildNodes()) {
      <hlm-icon name="lucideChevronRight" class="h-3.5 w-3.5" />
    }
  `,
})
export class HlmBreadcrumbSeparatorComponent {
  public readonly class = input<string>('');

  protected _computedClass = computed(() => hlm('h-3.5', this.class()));
}
