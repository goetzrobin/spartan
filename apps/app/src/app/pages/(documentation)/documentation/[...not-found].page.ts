import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { metaWith } from '~/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Not Found' },
	meta: metaWith('spartan - Page not found', 'Seems like you got lost browsing spartan'),
	title: 'spartan - Page not found',
};

@Component({
	selector: 'spartan-docs-not-found',
	standalone: true,
	imports: [MainSectionDirective],
	template: `
		<section spartanMainSection class="flex flex-col items-center justify-center">
			<div class="-mt-[25%] mb-8 flex h-full items-center">
				<p class="${hlmMuted}">Coming soon...</p>
			</div>
		</section>
	`,
})
export default class DocumentationNotFoundPageComponent {}
