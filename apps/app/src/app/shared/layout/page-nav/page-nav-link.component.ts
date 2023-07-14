import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'spartan-page-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  host: {
    class: 'mt-0 pt-2',
    role: 'listitem',
  },
  template: `
    <a
      [routerLink]="[]"
      [relativeTo]="activatedRoute"
      [fragment]="fragment"
      class="rounded inline-block no-underline transition-colors hover:text-foreground text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
