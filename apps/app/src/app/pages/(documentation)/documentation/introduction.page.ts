import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { TwoSectionPageDirective } from '~/app/shared/layout/two-section-page.directive';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from '@ng-spartan/ui/accordion/brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@ng-spartan/ui/accordion/helm';
import { RouterLink } from '@angular/router';
import { SideNavLinkComponent } from '~/app/shared/layout/page-nav-link.component';
import { SideNavComponent } from '~/app/shared/layout/page-nav.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Introduction' },
  meta: metaWith(
    'Introduction - SPARTAN',
    'SPARTAN is a collection of tools to superpower your Angular full-stack development.'
  ),
};

@Component({
  selector: 'spartan-docs-intro',
  standalone: true,
  imports: [
    MainSectionDirective,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    SideNavComponent,
    BrnAccordionComponent,
    BrnAccordionContentComponent,
    BrnAccordionItemComponent,
    BrnAccordionTriggerComponent,
    HlmAccordionContentDirective,
    HlmAccordionDirective,
    HlmAccordionIconComponent,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    RouterLink,
    SideNavComponent,
    SideNavLinkComponent,
    SideNavComponent,
  ],
  hostDirectives: [TwoSectionPageDirective],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Introduction" lead="Cutting-edge tools powering Angular full-stack development." />

      <spartan-section-sub-heading id="faq">FAQ</spartan-section-sub-heading>
      <brn-accordion hlm>
        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is SPARTAN</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            It is a collection of full-stack technologies that provide end-to-end type-safety.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is SPARTAN Brain</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            A collection of unstyled UI primitives that provide accessibility out of the box.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is SPARTAN Helm</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            Directives, sometimes additional components, that provide shadcn like styles for the Angular ecosystem.
          </brn-accordion-content>
        </brn-accordion-item>
      </brn-accordion>
    </section>

    <spartan-page-nav>
      <spartan-page-nav-link fragment="faq" label="FAQ" />
    </spartan-page-nav>
  `,
})
export default class DocsIntroPageComponent {}
