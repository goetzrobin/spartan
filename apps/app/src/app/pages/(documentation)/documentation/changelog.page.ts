import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { ComingSoonComponent } from '~/app/shared/layout/coming-soon.component';
import { hlmP } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Changelog' },
  meta: metaWith('spartan - Changelog', 'Latest updates and announcements.'),
  title: 'spartan - Changelog',
};

@Component({
  selector: 'spartan-changelog',
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
      <spartan-section-intro name="Changelog" lead="Latest updates and announcements." />
      <p class="flex flex-1 ${hlmP}">Initial Release. Changes to come soon!</p>
      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="about" label="About" />
        <spartan-page-bottom-nav-link direction="previous" href="cli" label="CLI" />
      </spartan-page-bottom-nav>
    </section>
  `,
})
export default class ChangelogPageComponent {}
