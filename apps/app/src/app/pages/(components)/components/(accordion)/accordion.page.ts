import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { CodeComponent } from '~/app/shared/code/code.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { TabsComponent } from '~/app/shared/layout/tabs.component';
import { CodePreviewDirective } from '~/app/shared/code/code-preview.directive';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav-link.component';
import { SideNavComponent } from '~/app/shared/layout/page-nav.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav-link.component';
import { PageBottomNavPlaceholderComponent } from '~/app/shared/layout/page-bottom-nav-placeholder.component';
import { AccordionPreviewComponent, codeImports, codeSkeleton, codeString } from './accordion.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Accordion' },
  meta: metaWith(
    'Accordion - SPARTAN',
    'A vertically stacked set of interactive headings that each reveal a section of content.'
  ),
};

@Component({
  selector: 'spartan-accordion',
  standalone: true,
  imports: [
    MainSectionDirective,
    CodeComponent,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    TabsComponent,
    AccordionPreviewComponent,
    CodePreviewDirective,
    PageNavLinkComponent,
    SideNavComponent,
    PageBottomNavComponent,
    PageBottomNavLinkComponent,
    PageBottomNavPlaceholderComponent,
  ],
  hostDirectives: [TwoSectionPageDirective],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Accordion"
        lead="A vertically stacked set of interactive headings that each reveal a section of content."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab><spartan-accordion-preview /></div>
        <spartan-code secondTab [code]="code" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @ng-spartan/ui/accordion" />
        <spartan-code secondTab language="sh" code="npm install @ng-spartan/ui/accordion" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="imports" />
        <spartan-code [code]="codeSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-placeholder />
        <spartan-page-bottom-nav-link href="alert" label="Alert" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
    </spartan-page-nav>
  `,
})
export default class AccordionPageComponent {
  code = codeString;
  imports = codeImports;
  skeleton = codeSkeleton;
  protected readonly codeSkeleton = codeSkeleton;
}
