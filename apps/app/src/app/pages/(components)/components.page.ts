import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerDirective } from '~/app/shared/layout/container.directive';
import { SidePanelComponent } from '~/app/shared/layout/side-panel/side-panel.component';
import { RedirectDirective } from '~/app/shared/meta/redirect.directive';
import { BreadcrumbsComponent } from '~/app/shared/breadcrumbs/breadcrumbs.component';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';

export const routeMeta: RouteMeta = {
  meta: metaWith('Components - SPARTAN', 'SPARTAN UI stack'),
  data: {
    breadcrumb: 'Components',
  },
};

@Component({
  selector: 'spartan-components',
  standalone: true,
  imports: [RouterOutlet, SidePanelComponent, BreadcrumbsComponent, TwoSectionPageDirective, MainSectionDirective],
  hostDirectives: [ContainerDirective, RedirectDirective],
  template: `
    <spartan-side-panel />
    <section class="px-4 sm:px-0 py-6 lg:gap-10 lg:py-8">
      <spartan-breadcrumbs />
      <router-outlet />
    </section>
  `,
})
export default class ComponentsPageComponent {
  private _redirect = inject(RedirectDirective, { host: true });
  constructor() {
    this._redirect.endsWith = 'components';
    this._redirect.commands = ['accordion'];
  }
}
