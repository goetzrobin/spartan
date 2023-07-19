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
import { defaultCode, defaultImports, defaultSkeleton, MenubarPreviewComponent } from './menubar.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Menubar' },
  meta: metaWith(
    'spartan/ui - Menubar',
    'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.'
  ),
  title: 'spartan/ui - Menubar',
};
@Component({
  selector: 'spartan-menubar',
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
    MenubarPreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Menubar"
        lead="A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-menubar-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui/menubar" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui/menubar" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="popover" label="Popover" />
        <spartan-page-bottom-nav-link direction="previous" href="label" label="Label" />
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
