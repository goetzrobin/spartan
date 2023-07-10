import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerDirective } from '~/app/shared/layout/container.directive';
import { SideNavComponent } from '~/app/shared/layout/side-nav/side-nav.component';
import { RedirectDirective } from '~/app/shared/meta/redirect.directive';
import { BreadcrumbsComponent } from '~/app/shared/breadcrumbs/breadcrumbs.component';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';

export const routeMeta: RouteMeta = {
  meta: metaWith('spartan/stack', 'SPARTAN full-stack'),
  data: {
    breadcrumb: 'Stack',
  },
};

@Component({
  selector: 'spartan-stack',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, BreadcrumbsComponent, TwoSectionPageDirective, MainSectionDirective],
  hostDirectives: [ContainerDirective, RedirectDirective],
  template: `
    <spartan-side-nav />
    <section class="px-4 sm:px-0 py-6 lg:gap-10 lg:py-8">
      <spartan-breadcrumbs />
      <router-outlet />
    </section>
  `,
})
export default class StackPageComponent {
  private _redirect = inject(RedirectDirective, { host: true });
  constructor() {
    this._redirect.endsWith = 'stack';
    this._redirect.commands = ['overview'];
  }
}
