import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { NavLinkDirective } from '@spartan-ng/app/app/shared/spartan-nav-link.directive';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmH1, hlmLead } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	meta: metaWith('Examples - SPARTAN', 'Examples built with the SPARTAN stack and its UI primitives'),
};

@Component({
	selector: 'spartan-examples',
	standalone: true,
	imports: [RouterOutlet, HlmButtonDirective, RouterLink, NavLinkDirective],
	host: {
		class: 'block p-4 pt-6 sm:pb-16 sm:pt-12',
	},
	template: `
		<h1 class="${hlmH1}">Check out some examples.</h1>
		<p class="${hlmLead} mt-4 max-w-xl">
			Dashboard, cards, authentication. Some examples built using the components. Use this as a guide to build your own.
		</p>
		<div class="mt-6 space-x-2">
			<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
			<a hlmBtn size="sm" variant="outline" routerLink="/components">Components</a>
		</div>

		<nav class="mt-12 mb-2">
			<ul class="flex space-x-2">
				<li><a class="!font-medium" spartanNavLink="/examples/notes">Notes</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/typography">Typography</a></li>
			</ul>
		</nav>
		<div class="overflow-hidden border rounded-lg border-border">
			<router-outlet />
		</div>
	`,
})
export default class ExamplesPageComponent {}
