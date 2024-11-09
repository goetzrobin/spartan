import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmBreadcrumbPage]',
  standalone: true,
  host: {
    role: 'link',
    '[class]': '_computedClass()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-current]': 'page',
  },
})
export class HlmBreadcrumbPageDirective {
  public readonly class = input('');

  protected _computedClass = computed(() =>
    hlm('font-normal text-foreground', this.class())
  );
}
