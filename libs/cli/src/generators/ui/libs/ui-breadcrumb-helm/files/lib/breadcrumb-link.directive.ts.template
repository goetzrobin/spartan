import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmBreadcrumbLink]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmBreadcrumbLinkDirective {
  public readonly class = input('');

  protected _computedClass = computed(() =>
    hlm('transition-colors hover:text-foreground', this.class())
  );
}
