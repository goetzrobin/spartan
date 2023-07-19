import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { CodeComponent } from '~/app/shared/code/code.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { TabsComponent } from '~/app/shared/layout/tabs.component';
import { CodePreviewDirective } from '~/app/shared/code/code-preview.directive';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavPlaceholderComponent } from '~/app/shared/layout/page-bottom-nav-placeholder.component';
import { CollapsiblePreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './collapsible.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Collapsible' },
  meta: metaWith('spartan/ui - Collapsible', 'An interactive component which expands/collapses a panel.'),
  title: 'spartan/ui - Collapsible',
};

@Component({
  selector: 'spartan-collapsible',
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
    PageBottomNavPlaceholderComponent,
    CollapsiblePreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Collapsible" lead="An interactive component which expands/collapses a panel." />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-collapsible-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui/collapsible" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui/collapsible" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="combobox" label="Combobox" />
        <spartan-page-bottom-nav-link direction="previous" href="card" label="Card" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
    </spartan-page-nav>
  `,
})
export default class CollapsiblePageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
}
