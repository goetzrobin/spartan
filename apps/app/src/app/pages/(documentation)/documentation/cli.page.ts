import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { ComingSoonComponent } from '~/app/shared/layout/coming-soon.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'CLI' },
  meta: metaWith('spartan - CLI', 'Supercharge your spartan experience with our CLI.'),
  title: 'spartan - CLI',
};

@Component({
  selector: 'spartan-cli',
  standalone: true,
  imports: [
    MainSectionDirective,
    SectionIntroComponent,
    PageBottomNavComponent,
    PageBottomNavLinkComponent,
    PageNavComponent,
    ComingSoonComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="CLI" lead="Supercharge your spartan experience with our CLI." />

      <spartan-coming-soon />

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="changelog" label="Changelog" />
        <spartan-page-bottom-nav-link direction="previous" href="introduction" label="Introduction" />
      </spartan-page-bottom-nav>
    </section>
  `,
})
export default class ChangelogPageComponent {}
