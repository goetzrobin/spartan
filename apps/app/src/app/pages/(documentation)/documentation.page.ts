import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerDirective } from '~/app/shared/layout/container.directive';
import { SideNavComponent } from '~/app/shared/layout/side-nav/side-nav.component';
import { BreadcrumbsComponent } from '~/app/shared/breadcrumbs/breadcrumbs.component';
import { RouteMeta } from '@analogjs/router';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';

export const routeMeta: RouteMeta = {
  data: {
    breadcrumb: 'Docs',
  },
};
@Component({
  selector: 'spartan-documentation',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, BreadcrumbsComponent, TwoSectionPageDirective, MainSectionDirective],
  hostDirectives: [ContainerDirective],
  host: {
    class: '',
  },
  template: `
    <spartan-side-nav />
    <section class="flex flex-col lg:py-8 overflow-x-hidden px-4 py-6 sm:px-0">
      <spartan-breadcrumbs />
      <router-outlet />
    </section>
  `,
})
export default class ExamplesPageComponent {}
