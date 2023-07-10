import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'spartan-page-nav-link',
  standalone: true,
  imports: [RouterLink],
  host: {
    class: 'mt-0 pt-2',
    role: 'listitem',
  },
  template: `
    <a
      [routerLink]="[]"
      [relativeTo]="activatedRoute"
      [fragment]="fragment"
      class="inline-block no-underline transition-colors hover:text-foreground text-muted-foreground"
      >{{ label }}</a
    >
  `,
})
export class PageNavLinkComponent {
  protected activatedRoute = inject(ActivatedRoute);
  @Input()
  fragment = '';
  @Input()
  label = '';
}
