import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { PageComponent } from '~/app/shared/layout/page.component';

export const routeMeta: RouteMeta = {
  meta: metaWith('spartan/stack - The stack', "spartan's opinionated full-stack..."),
  data: {
    breadcrumb: 'Stack',
  },
  title: 'spartan/stack - The stack',
};

@Component({
  selector: 'spartan-stack',
  standalone: true,
  imports: [PageComponent],
  template: ` <spartan-page />`,
})
export default class StackPageComponent {}
