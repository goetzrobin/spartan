import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { hlmP } from '@ng-spartan/ui/typography/helm';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { ArchitectureDiagramAngularComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-angular.component';
import { ArchitectureDiagramAnalogComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-analog.component';
import { ArchitectureDiagramTrpcComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-trpc.component';
import { ArchitectureDiagramDrizzleComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-drizzle.component';
import { ArchitectureDiagramSupabaseComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-supabase.component';
import { ArchitectureDiagramNxComponent } from '~/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-nx.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Technologies' },
  meta: metaWith('spartan/stack - Technologies', 'The spartan/stack'),
  title: 'spartan/ui - Technologies',
};

@Component({
  selector: 'spartan-technologies',
  standalone: true,
  imports: [
    MainSectionDirective,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    PageBottomNavComponent,
    PageBottomNavLinkComponent,
    PageNavComponent,
    PageNavLinkComponent,
    ArchitectureDiagramAngularComponent,
    ArchitectureDiagramAnalogComponent,
    ArchitectureDiagramTrpcComponent,
    ArchitectureDiagramDrizzleComponent,
    ArchitectureDiagramSupabaseComponent,
    ArchitectureDiagramNxComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Technologies"
        lead="The spartan/stack is an opinionated full-stack that consists of
      multiple technologies providing e2e type safety to Angular developers."
      />

      <spartan-section-sub-heading first id="nx">Nx</spartan-section-sub-heading>
      <spartan-architecture-diagram-nx />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-section-sub-heading id="analogjs">AnalogJs</spartan-section-sub-heading>
      <spartan-architecture-diagram-analog />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-section-sub-heading id="angular">Angular</spartan-section-sub-heading>
      <spartan-architecture-diagram-angular />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-section-sub-heading id="trpc">tRPC</spartan-section-sub-heading>
      <spartan-architecture-diagram-trpc />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-section-sub-heading id="drizzle">Drizzle</spartan-section-sub-heading>
      <spartan-architecture-diagram-drizzle />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-section-sub-heading id="supabase">Supabase</spartan-section-sub-heading>
      <spartan-architecture-diagram-supabase />
      <p class="${hlmP}">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem eligendi hic minus mollitia
        numquam perferendis qui rem unde. Adipisci aliquam commodi dicta explicabo illum non nostrum odio quis!
      </p>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="/components/accordion" label="spartan/ui" />
        <spartan-page-bottom-nav-link direction="previous" href="overview" label="Overview" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="nx" label="Nx" />
      <spartan-page-nav-link fragment="analogjs" label="AnalogJs" />
      <spartan-page-nav-link fragment="angular" label="Angular" />
      <spartan-page-nav-link fragment="trpc" label="tRPC" />
      <spartan-page-nav-link fragment="drizzle" label="Drizzle" />
      <spartan-page-nav-link fragment="supabase" label="Supabase" />
    </spartan-page-nav>
  `,
})
export default class AccordionPageComponent {}
