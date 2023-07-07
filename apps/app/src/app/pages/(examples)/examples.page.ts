import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { hlmH1, hlmLead } from '@ng-spartan/ui/typography/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { NavLinkDirective } from '~/app/shared/spartan-nav-link.directive';
import { RedirectDirective } from '~/app/shared/meta/redirect.directive';

export const routeMeta: RouteMeta = {
  meta: metaWith('Examples - SPARTAN', 'Examples built with the SPARTAN stack and its UI primitives'),
};

@Component({
  selector: 'spartan-examples',
  standalone: true,
  imports: [RouterOutlet, HlmButtonDirective, RouterLink, NavLinkDirective],
  hostDirectives: [RedirectDirective],
  host: {
    class: 'block p-4 pt-6 sm:pb-16 sm:pt-12',
  },
  template: `
    <h1 class="${hlmH1}">Check out some examples.</h1>
    <p class="mt-4 max-w-xl ${hlmLead}">
      Dashboard, cards, authentication. Some examples built using the components. Use this as a guide to build your own.
    </p>
    <div class="mt-6 space-x-2">
      <a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
      <a hlmBtn size="sm" variant="outline" routerLink="/components">Components</a>
    </div>

    <nav class="mb-2 mt-12">
      <ul class="flex space-x-2">
        <li><a class="!font-medium" spartanNavLink="/examples/notes">Notes</a></li>
        <li><a class="!font-medium" spartanNavLink="/examples/typography">Typography</a></li>
      </ul>
    </nav>
    <div class="rounded-lg border border-border overflow-hidden">
      <router-outlet />
    </div>
  `,
})
export default class ExamplesPageComponent {
  private _redirect = inject(RedirectDirective, { host: true });
  constructor() {
    this._redirect.endsWith = 'examples';
    this._redirect.commands = ['notes'];
  }
}
