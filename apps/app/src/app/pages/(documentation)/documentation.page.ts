import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { PageComponent } from '~/app/shared/layout/page.component';

export const routeMeta: RouteMeta = {
  data: {
    breadcrumb: 'Docs',
  },
};
@Component({
  selector: 'spartan-documentation',
  standalone: true,
  imports: [PageComponent],
  template: ` <spartan-page /> `,
})
export default class ExamplesPageComponent {}
