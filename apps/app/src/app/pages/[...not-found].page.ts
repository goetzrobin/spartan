import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { hlmH3, hlmMuted } from '@spartan-ng/ui-typography-helm';
import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { RouterLink } from '@angular/router';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Not Found' },
  meta: metaWith('spartan - Page not found', 'Seems like you got lost browsing spartan.'),
  title: 'spartan - Page not found',
};

@Component({
  selector: 'spartan-not-found',
  standalone: true,
  imports: [HlmSeparatorDirective, HlmButtonDirective, RouterLink],
  host: {
    class: 'h-full flex flex-col items-center justify-center',
  },
  template: `
    <div class="-mt-[25%] flex items-center mb-8">
      <h1 class="${hlmH3}">404</h1>
      <hr hlmSeparator class="h-8 mx-4" orientation="vertical" />
      <p class="${hlmMuted}">This page could not be found</p>
    </div>
    <a routerLink="/" size="sm" class="text-xs" hlmBtn variant="link">Back home</a>
  `,
})
export default class NotFoundComponent {}
