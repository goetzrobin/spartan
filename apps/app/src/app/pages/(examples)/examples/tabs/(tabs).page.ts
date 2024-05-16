import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { metaWith } from '../../../../shared/meta/meta.util';
import { TabsDefaultExamplePageComponent } from './components/tab-default.component';
import { TabsPaginatedExamplePageComponent } from './components/tab-paginated.component';
import { TabsVerticalExamplePageComponent } from './components/tab-vertical.component';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Tabs', 'A tabs example displaying the SPARTAN stack and new UI primitives'),
	title: 'spartan/examples - Tabs',
};

@Component({
	selector: 'spartan-tabs-example',
	standalone: true,
	imports: [TabsDefaultExamplePageComponent, TabsVerticalExamplePageComponent, TabsPaginatedExamplePageComponent],
	host: {
		class: 'block p-2 sm:p-4 pb-16 grid grid-cols-2 grid-rows-1 gap-y-5',
	},
	template: `
		<spartan-tabs-default-example-preview />
        <spartan-tabs-example-vertical />
        <spartan-tabs-example-paginated />
	`,
})
export default class TabsWrapperExamplePageComponent {}
