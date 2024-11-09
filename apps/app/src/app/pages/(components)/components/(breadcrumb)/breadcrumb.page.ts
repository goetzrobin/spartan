import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { metaWith } from '../../../../shared/meta/meta.util';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { BreadcrumbPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './breadcrumb.preview';
import {
	breadcrumbCustomSeparatorCode,
	BreadcrumbCustomSeparatorComponent,
	breadcrumbCustomSeparatorSkeleton,
} from './breadcrumb--custom-separator.example';
import { breadcrumbDropdownCode, BreadcrumbDropdownComponent } from './breadcrumb--dropdown.example';
import {
	BreadcrumbCollapsedComponent,
	breadcrumbCollapsedSkeleton,
	breadcrumbCollapsedCode,
} from './breadcrumb--collapsed.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Breadcrumb' },
	meta: metaWith('spartan/ui - Breadcrumb', 'Displays the path to the current resource using a hierarchy of links.'),
	title: 'spartan/ui - Breadcrumb',
};
@Component({
	selector: 'spartan-breadcrumb',
	standalone: true,
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		CodePreviewDirective,
		TabsCliComponent,

		BreadcrumbPreviewComponent,
		BreadcrumbCustomSeparatorComponent,
		BreadcrumbDropdownComponent,
		BreadcrumbCollapsedComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Breadcrumb"
				lead="Displays the path to the current resource using a hierarchy of links."
			/>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui breadcrumb"
				ngCode="ng g @spartan-ng/cli:ui breadcrumb"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__default" class="${hlmH4} mt-6">Custom separator</h3>
			<p class="${hlmP} mb-2">
				Use a custom component as
				<code class="${hlmCode} mr-0.5">children</code>
				for
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbSeparator</code>
				to create a custom separator.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-custom-separator />
				</div>
				<spartan-code secondTab [code]="customSeparatorCode" />
			</spartan-tabs>
			<div class="mt-6">
				<spartan-code [code]="customSeparatorSkeleton" />
			</div>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__default" class="${hlmH4}">Dropdown</h3>
			<p class="${hlmP} mb-2">
				You can compose
				<code class="${hlmCode} mr-0.5">HlmBreadcrumbItem</code>
				for
				<code class="${hlmCode} mr-0.5">HlmDropdownMenu</code>
				to create a custom separator.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-dropdown />
				</div>
				<spartan-code secondTab [code]="dropdownCode" />
			</spartan-tabs>
			<div class="mt-6">
				<spartan-code [code]="dropdownSkeleton" />
			</div>

			<hr class="my-4 md:my-8" />

			<h3 id="examples__default" class="${hlmH4}">Collapsed</h3>
			<p class="${hlmP} mb-2">
				We provide a
				<code class="${hlmCode} mr-0.5">BreadcrumbEllipsis</code>
				component to show a collapsed state when the breadcrumb is too long.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-breadcrumb-collapsed />
				</div>
				<spartan-code secondTab [code]="collapsedCode" />
			</spartan-tabs>
			<div class="mt-6">
				<spartan-code [code]="collapsedSkeleton" />
			</div>
		</section>
	`,
})
export default class BreadcrumbPageComponent {
	readonly defaultCode = defaultCode;
	readonly defaultImports = defaultImports;
	readonly defaultSkeleton = defaultSkeleton;

	readonly customSeparatorCode = breadcrumbCustomSeparatorCode;
	readonly customSeparatorSkeleton = breadcrumbCustomSeparatorSkeleton;
	readonly dropdownCode = breadcrumbDropdownCode;
	readonly dropdownSkeleton = breadcrumbCollapsedSkeleton;
	readonly collapsedCode = breadcrumbCollapsedCode;
	readonly collapsedSkeleton = breadcrumbCollapsedSkeleton;
}