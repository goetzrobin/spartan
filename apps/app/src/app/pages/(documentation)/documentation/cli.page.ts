import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodeComponent } from '../../../shared/code/code.component';
import { ComingSoonComponent } from '../../../shared/layout/coming-soon.component';
import { MainSectionDirective } from '../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavLinkComponent } from '../../../shared/layout/page-nav/page-nav-link.component';
import { PageNavComponent } from '../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../shared/layout/section-sub-heading.component';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'CLI' },
	meta: metaWith('spartan - CLI', 'Supercharge your spartan experience with our CLI.'),
	title: 'spartan - CLI',
};

@Component({
	selector: 'spartan-cli',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		ComingSoonComponent,
		SectionSubHeadingComponent,
		CodeComponent,
		PageNavLinkComponent,
		HlmIconComponent,
	],
	providers: [provideIcons({ radixExclamationTriangle })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="CLI" lead="Supercharge your spartan experience with our CLI." />
			<section>
				<p class="${hlmP}">
					Ultimately our goal is to provide a standalone CLI that allows you to simply add spartan primitives to any
					Angular project.
				</p>
				<p class="${hlmP}">
					However, our initial focus is to provide a tight integration with the
					<code class="${hlmCode}">spartan/stack</code>
					, which runs on Nx. Therefore, the initial version of our CLI is a Nx plugin.
				</p>
			</section>

			<spartan-section-sub-heading id="nx">&#64;spartan-ng/nx</spartan-section-sub-heading>
			<section>
				<div>
					<p class="${hlmP}">
						To add
						<code class="${hlmCode}">spartan</code>
						to your Nx workspace simply install the plugin with the command below:
					</p>
					<spartan-code class="mt-4" code="npm i -D @spartan-ng/nx" />
				</div>

				<h3 class="${hlmH4} mt-12">ui</h3>
				<div>
					<p class="${hlmP}">
						To add
						<code class="${hlmCode}">spartan/ui</code>
						primitives to your workspace run the following command:
					</p>
					<spartan-code class="mt-4" code="npx nx g @spartan-ng/nx:ui" />
					<p class="${hlmP}">
						You can then select which primitives you want to add. For each primitive we create a buildable library at a
						path of your choice.
					</p>
				</div>

				<h3 class="${hlmH4} mt-12">ui-theme</h3>
				<div>
					<p class="${hlmP}">Adding a theme can also be done on itself. Use the command below:</p>
					<spartan-code class="mt-4" code="npm nx @spartan-ng/nx:ui-theme" />
					<p class="${hlmP}">
						You can then select which application you want to add the theme to. Where your styles entrypoint is located.
						Which theme to add & what border radius to use.
					</p>
				</div>
			</section>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="changelog" label="Changelog" />
				<spartan-page-bottom-nav-link direction="previous" href="introduction" label="Introduction" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav>
			<spartan-page-nav-link fragment="nx" label="@spartan-ng/nx" />
		</spartan-page-nav>
	`,
})
export default class CliPageComponent {}
