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
import { defaultCode, defaultImports, defaultSkeleton, ScrollAreaPreviewComponent } from './scroll-area.preview';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';
import { provideIcons } from '@spartan-ng/icon-helm';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Scroll Area' },
  meta: metaWith('spartan/ui - Scroll Area', 'Augments native scroll functionality for custom, cross-browser styling.'),
  title: 'spartan/ui - Scroll Area',
};
@Component({
  selector: 'spartan-scroll-area',
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
    ScrollAreaPreviewComponent,
    InstallationCsComponent,
  ],
  providers: [provideIcons({ radixExclamationTriangle })],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Scroll Area"
        lead="Augments native scroll functionality for custom, cross-browser styling."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-scroll-area-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
        <spartan-code firstTab language="sh" code="npx nx g @spartan-ng/nx:ui scrollarea" />
        <spartan-installation-cs secondTab />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="separator" label="Separator" />
        <spartan-page-bottom-nav-link direction="previous" href="radio-group" label="Radio Group" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
    </spartan-page-nav>
  `,
})
export default class LabelPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
}
