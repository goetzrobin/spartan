import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import {
	AlertDestructiveComponent,
	destructiveCode,
} from '~/app/pages/(components)/components/(alert)/alert--destructive.example';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';
import { CodePreviewDirective } from '~/app/shared/code/code-preview.directive';
import { CodeComponent } from '~/app/shared/code/code.component';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '~/app/shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { TabsComponent } from '~/app/shared/layout/tabs.component';
import { metaWith } from '~/app/shared/meta/meta.util';
import { AlertPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './alert.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Alert' },
	meta: metaWith('spartan/ui - Alert', 'Displays a callout for user attention.'),
	title: 'spartan/ui - Alert',
};

@Component({
	selector: 'spartan-alert',
	standalone: true,
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		AlertPreviewComponent,
		CodePreviewDirective,
		PageNavLinkComponent,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavPlaceholderComponent,
		AlertDestructiveComponent,
		InstallationCsComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Alert" lead="Displays a callout for user attention." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
				<spartan-code firstTab language="sh" code="npx nx g @spartan-ng/nx:ui alert" />
				<spartan-installation-cs secondTab />
			</spartan-tabs>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 class="${hlmH4} mb-2 mt-6">Default</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>
			<h3 class="${hlmH4} mb-2 mt-6">Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-destructive />
				</div>
				<spartan-code secondTab [code]="destructiveCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert-dialog" label="Alert Dialog" />
				<spartan-page-bottom-nav-link direction="previous" href="accordion" label="Accordion" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav>
			<spartan-page-nav-link fragment="installation" label="Installation" />
			<spartan-page-nav-link fragment="usage" label="Usage" />
			<spartan-page-nav-link fragment="examples" label="Examples" />
		</spartan-page-nav>
	`,
})
export default class AlertPageComponent {
	readonly defaultCode = defaultCode;
	readonly defaultSkeleton = defaultSkeleton;
	readonly defaultImports = defaultImports;

	readonly destructiveCode = destructiveCode;
}
