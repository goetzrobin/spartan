import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmBreadcrumbItem]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmBreadcrumbItemDirective {
  public readonly class = input('');

  protected _computedClass = computed(() =>
    hlm('inline-flex items-center gap-1.5', this.class())
  );
}
