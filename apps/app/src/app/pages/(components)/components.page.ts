import type { RouteMeta } from '@analogjs/router';
import { injectLoad } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ComponentApiData } from '../../core/models/ui-docs.model';
import { UIDocsService } from '../../core/services/ui-docs.service';
import { PageComponent } from '../../shared/layout/page.component';
import { metaWith } from '../../shared/meta/meta.util';
import { load } from './components.server';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Components',
		'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn-like styling options.',
	),
	data: {
		breadcrumb: 'Components',
	},
	title: 'spartan/ui - Components',
};

@Component({
	selector: 'spartan-components',
	standalone: true,
	imports: [
		PageComponent,
		HlmAlertDirective,
		HlmAlertTitleDirective,
		HlmAlertDescriptionDirective,
		HlmIconComponent,
		HlmAlertIconDirective,
	],
	providers: [provideIcons({ lucideRocket }), UIDocsService],
	template: `
		<div
			hlmAlert
			class="text-primary-foreground border-border bg-primary mx-auto my-2 max-w-[95vw] rounded-lg border p-4"
		>
			<hlm-icon hlmAlertIcon name="lucideRocket" class="!text-primary-foreground" />
			<h2 hlmAlertTitle>Components are in alpha</h2>
			<p hlmAlertDesc>
				Try them out! We'd love to hear your feedback! Expect breaking changes!
				<a class="underline" target="_blank" href="https://github.com/goetzrobin/spartan">
					Become the one making those changes on GitHub!
				</a>
			</p>
		</div>
		<spartan-page />
	`,
})
export default class ComponentsPageComponent {
	private readonly _apiData = toSignal(injectLoad<typeof load>(), { requireSync: true });
	private readonly _uiDocsService = inject(UIDocsService);

	constructor() {
		this._uiDocsService.setAPIData(this._apiData() as ComponentApiData);
	}
}
