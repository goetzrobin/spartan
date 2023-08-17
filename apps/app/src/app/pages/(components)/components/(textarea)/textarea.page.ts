import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { CodeComponent } from '~/app/shared/code/code.component';
import { CodePreviewDirective } from '~/app/shared/code/code-preview.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { TabsComponent } from '~/app/shared/layout/tabs.component';
import { defaultCode, defaultImports, defaultSkeleton, TextAreaPreviewComponent } from './textarea.preview';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Textarea' },
  meta: metaWith(
    'spartan/ui - Textarea',
    'Gives a textarea field or a component a distinct look that indicates its input capabilities.'
  ),
  title: 'spartan/ui - Textarea',
};
@Component({
  selector: 'spartan-textarea',
  standalone: true,
  imports: [
    MainSectionDirective,
    CodeComponent,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    TabsComponent,
    CodePreviewDirective,
    PageNavLinkComponent,
    PageNavComponent,
    PageBottomNavComponent,
    PageBottomNavLinkComponent,
    TextAreaPreviewComponent,
    InstallationCsComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Textarea"
        lead="Gives a textarea field or a component a distinct look that indicates its input capabilities."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-textarea-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="note">Note</spartan-section-sub-heading>
      <p class="${hlmP} mb-6">
        To get that same distinct look of a spartan/ui input we can simply apply the same
        <code class="${hlmCode}">hlmInput</code> directive we would apply to other input elements.
      </p>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
        <spartan-code firstTab language="sh" code="npx nx @spartan-ng/nx:ui input" />
        <spartan-installation-cs secondTab />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="toggle" label="Toggle" />
        <spartan-page-bottom-nav-link direction="previous" href="tabs" label="Tabs" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="note" label="Note" />
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
    </spartan-page-nav>
  `,
})
export default class TextAreaPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
}
