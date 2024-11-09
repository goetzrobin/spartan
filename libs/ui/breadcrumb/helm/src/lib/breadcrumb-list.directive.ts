import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
  selector: '[hlmBreadcrumbList]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmBreadcrumbListDirective {
  public readonly class = input('');

  protected _computedClass = computed(() =>
    hlm(
      'flex items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 h-5',
      this.class()
    )
  );
}
