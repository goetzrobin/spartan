import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { PageComponent } from '@spartan-ng/app/app/shared/layout/page.component';

export const routeMeta: RouteMeta = {
	data: {
		breadcrumb: 'Docs',
	},
};
@Component({
	selector: 'spartan-documentation',
	standalone: true,
	imports: [PageComponent],
	template: `
		<spartan-page />
	`,
})
export default class ExamplesPageComponent {}
