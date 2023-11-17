import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { HlmAspectRatioDirective } from '@spartan-ng/ui-aspectratio-helm';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodeComponent } from '~/app/shared/code/code.component';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { metaWith } from '~/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Figma' },
	meta: metaWith(
		'spartan - Figma',
		'Every component recreated in Figma. With customizable props, typography and icons.',
	),
	title: 'spartan - Figma',
};

@Component({
	selector: 'spartan-figma',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		SectionSubHeadingComponent,
		CodeComponent,
		HlmAspectRatioDirective,
		PageNavLinkComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Figma"
				lead="Every component recreated in Figma. With customizable props, typography and icons."
			/>
			<section>
				<p class="${hlmP}">
					Since
					<code class="${hlmCode}">spartan/ui</code>
					proudly & shamelessly piggy backs on top of the incredible work by
					<span>shadcn,</span>
					it can leverage their (non Angular specific) ecosystem.
				</p>
				<p class="${hlmP}">
					That means we get access to incredibly work like
					<a class="font-medium hover:underline" href="https://twitter.com/skirano" target="_blank">
						Pietro Schirano's
					</a>
					Figma UI Kit!
				</p>
				<div class="mt-4" hlmAspectRatio="16/9">
					<iframe
						src="https://embed.figma.com/file/1203061493325953101/hf_embed?community_viewer=true&amp;embed_host=shadcn&amp;hub_file_id=1203061493325953101&amp;kind=&amp;viewer=1"
						class="bg-muted h-full w-full overflow-hidden rounded-lg border"
					></iframe>
				</div>
			</section>
			<spartan-section-sub-heading id="copy">Grab a copy</spartan-section-sub-heading>
			<a
				class="text-lg font-medium underline"
				target="_blank"
				href="https://www.figma.com/community/file/1203061493325953101"
			>
				https://www.figma.com/community/file/1203061493325953101
			</a>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/components" label="Components" />
				<spartan-page-bottom-nav-link direction="previous" href="typography" label="Typography" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav>
			<spartan-page-nav-link fragment="copy" label="Grab a copy" />
		</spartan-page-nav>
	`,
})
export default class FigmaPageComponent {}
