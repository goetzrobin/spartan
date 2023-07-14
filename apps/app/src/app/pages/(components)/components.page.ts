import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { PageComponent } from '~/app/shared/layout/page.component';

export const routeMeta: RouteMeta = {
  meta: metaWith(
    'spartan/ui - Components',
    'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn like styling options.'
  ),
  data: {
    breadcrumb: 'Components',
  },
  title: 'spartan/ui - Components',
};

@Component({
  selector: 'spartan-components',
  standalone: true,
  imports: [PageComponent],
  template: `<spartan-page /> `,
})
export default class ComponentsPageComponent {}
