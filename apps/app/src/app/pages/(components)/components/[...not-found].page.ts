import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { hlmMuted } from '@ng-spartan/ui/typography/helm';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Not Found' },
  meta: metaWith('Page not found - SPARTAN', 'Seems like you got lost browsing SPARTAN.'),
};

@Component({
  selector: 'spartan-components-not-found',
  standalone: true,
  imports: [MainSectionDirective],
  hostDirectives: [TwoSectionPageDirective],
  template: `
    <section spartanMainSection class="flex flex-col items-center justify-center">
      <div class="-mt-[25%] flex items-center mb-8">
        <p class="${hlmMuted}">Coming soon...</p>
      </div>
    </section>
  `,
})
export default class ComponentsNotFoundPageComponent {}
