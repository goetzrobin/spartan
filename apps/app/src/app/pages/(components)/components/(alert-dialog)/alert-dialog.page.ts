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
import { AlertDialogPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './alert-dialog.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Alert Dialog' },
  meta: metaWith(
    'spartan/ui - Alert Dialog',
    'A modal dialog that interrupts the user with important content and expects a response.',
  ),
  title: 'spartan/ui - Alert Dialog',
};

@Component({
  selector: 'spartan-alert-dialog',
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
    AlertDialogPreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Alert Dialog"
        lead="A modal dialog that interrupts the user with important content and expects a response."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-alert-dialog-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui-alert-dialog" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui-alert-dialog" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="aspect-ratio" label="Aspect Ratio" />
        <spartan-page-bottom-nav-link direction="previous" href="alert" label="Alert" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
    </spartan-page-nav>
  `,
})
export default class AlertPageComponent {
  readonly defaultCode = defaultCode;
  readonly defaultSkeleton = defaultSkeleton;
  readonly defaultImports = defaultImports;
}
