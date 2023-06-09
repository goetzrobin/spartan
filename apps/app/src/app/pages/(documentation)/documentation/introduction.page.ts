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
import { SideNavComponent } from '~/app/shared/layout/page-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav-link.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav.component';
import { PageBottomNavPlaceholderComponent } from '~/app/shared/layout/page-bottom-nav-placeholder.component';
import { hlmCode } from '@ng-spartan/ui/typography/helm';

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
    PageNavLinkComponent,
    PageBottomNavLinkComponent,
    PageBottomNavComponent,
    PageBottomNavPlaceholderComponent,
  ],
  hostDirectives: [TwoSectionPageDirective],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Introduction" lead="Cutting-edge tools powering Angular full-stack development." />
      <p class="mb-6">
        <code class="${hlmCode}">spartan</code> allows you to build next level, full-stack applications with AnalogJs.
      </p>
      <p>
        It provides you with an opinionated stack set up with a single command and a set of accessible UI primitives.
      </p>
      <spartan-section-sub-heading id="spartan-stack">spartan/stack</spartan-section-sub-heading>
      <p class="mb-6">
        The <code class="${hlmCode}">spartan/stack</code> is a collection of technologies that provide you with a
        typesafe developer experience from the template all the way to the database.
      </p>
      <p class="mb-12">
        While we keep updating the stack to provide the best available technologies,
        <code class="${hlmCode}">spartan/stack</code> is currently made up of the following:
        <code class="${hlmCode}">Supabase</code>, <code class="${hlmCode}">Angular</code>,
        <code class="${hlmCode}">tRPC</code>, <code class="${hlmCode}">Tailwind</code>,
        <code class="${hlmCode}">AnalogJs</code>, <code class="${hlmCode}">Nx</code>, and
        <code class="${hlmCode}">Drizzle</code>
      </p>
      <spartan-section-sub-heading id="spartan-ui">spartan/ui</spartan-section-sub-heading>
      <p class="mb-6">
        <code class="${hlmCode}">spartan/ui</code> is built on the
        <code class="${hlmCode}">spartan/ui/brain</code> library that provides accessible, but unstyled primitives that
        build the foundation of an inclusive user interface.
      </p>
      <p class="mb-6">
        On top we put <code class="${hlmCode}">spartan/ui/helm</code> library that gives our primitives a beautifully
        designed <span class="font-medium">shadcn</span> look.
      </p>
      <spartan-section-sub-heading id="faq">FAQ</spartan-section-sub-heading>
      <brn-accordion hlm>
        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is spartan/stack</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            It is a collection of full-stack technologies that power end-to-end type-safe Angular development.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is spartan/ui</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            A collection of Angular UI primitives that are both beautiful and accessible.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is spartan/ui/brain</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            A collection of unstyled UI primitives that provide accessibility out of the box.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <brn-accordion-trigger hlm>
            <span>What is spartan/ui/helm</span>
            <hlm-accordion-icon />
          </brn-accordion-trigger>
          <brn-accordion-content hlm>
            Directives, sometimes additional components, that give spartan/brain a shadcn look.
          </brn-accordion-content>
        </brn-accordion-item>
      </brn-accordion>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-placeholder />
        <spartan-page-bottom-nav-link href="cli" label="CLI" />
      </spartan-page-bottom-nav>
    </section>

    <spartan-page-nav>
      <spartan-page-nav-link fragment="spartan-stack" label="spartan/stack" />
      <spartan-page-nav-link fragment="spartan-ui" label="spartan/ui" />
      <spartan-page-nav-link fragment="faq" label="FAQ" />
    </spartan-page-nav>
  `,
})
export default class DocsIntroPageComponent {}
