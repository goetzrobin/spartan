import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { DialogContextMenuPreviewComponent, contextMenuCode } from './dialog-context-menu.preview';
import { DialogPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './dialog.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dialog' },
	meta: metaWith(
		'spartan/ui - Dialog',
		'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
	),
	title: 'spartan/ui - Dialog',
};
@Component({
	selector: 'spartan-dialog',
	standalone: true,
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		DialogPreviewComponent,
		DialogPreviewComponent,
		DialogContextMenuPreviewComponent,
		HlmAlertDirective,
		HlmAlertDescriptionDirective,
		HlmIconComponent,
		HlmAlertIconDirective,
		HlmAlertTitleDirective,
	],
	providers: [provideIcons({ lucideAlertTriangle })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Dialog"
				lead="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Angular CLI">
				<spartan-code firstTab language="sh" code="npx nx g @spartan-ng/cli:ui dialog" />
				<spartan-code secondTab language="sh" code="ng g @spartan-ng/cli:ui dialog" />
			</spartan-tabs>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="inside-menu">Inside Menu</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				You can nest dialogs inside context or dropdown menus. Make sure to wrap the menu-item inside the
				<code class="${hlmCode}">brn-dialog</code>
				component and apply the
				<code class="${hlmCode}">BrnDialogTrigger</code>
				directive. Another option is to use the
				<code class="${hlmCode}">brnDialogTriggerFor</code>
				alternative, which takes in a reference to the brn-dialog. That way you can avoid nesting the template.
			</p>
			<div hlmAlert class="mb-6" variant="destructive">
				<hlm-icon name="lucideAlertTriangle" hlmAlertIcon />
				<p hlmAlertTitle>Note</p>
				<p hlmAlertDescription class="leading-loose">
					Do not use the
					<code class="${hlmCode}">HlmMenuItem</code>
					or
					<code class="${hlmCode}">BrnMenuItem</code>
					directives as they conflict with
					<code class="${hlmCode}">BrnDialogTrigger</code>
					&
					<code class="${hlmCode}">brnDialogTriggerFor!</code>
					We expose the hlm variants so you can directly use them to style your elements. Check out the code of the
					example below!
				</p>
			</div>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-context-menu />
				</div>
				<spartan-code secondTab [code]="contextMenuCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DialogPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly contextMenuCode = contextMenuCode;
}
