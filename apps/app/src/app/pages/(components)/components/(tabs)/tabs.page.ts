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
import { defaultCode, defaultImports, defaultSkeleton, TabsPreviewComponent } from './tabs.preview';
import { InputPreviewComponent } from '~/app/pages/(components)/components/(input)/input.preview';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { TabsVerticalPreviewComponent, verticalCode } from './tabs--vertical.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Tabs' },
  meta: metaWith(
    'spartan/ui - Tabs',
    'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
  ),
  title: 'spartan/ui - Tabs',
};
@Component({
  selector: 'spartan-tabs-page',
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
    TabsPreviewComponent,
    InputPreviewComponent,
    TabsVerticalPreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Tabs"
        lead="A set of layered sections of content—known as tab panels—that are displayed one at a time."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-tabs-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui-tabs" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui-tabs" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
      <h3 class="mt-6 mb-2 ${hlmH4}">Default</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-tabs-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Vertical</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-tabs-vertical />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="textarea" label="Textarea" />
        <spartan-page-bottom-nav-link direction="previous" href="switch" label="Switch" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class TabsPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;

  protected readonly verticalCode = verticalCode;
}
