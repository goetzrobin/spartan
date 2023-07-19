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
import { defaultCode, defaultImports, defaultSkeleton, DropdownPreviewComponent } from './dropdown-menu.preview';
import { dropdownWithStateCode, DropdownWithStatePreviewComponent } from './dropdown-with-state.preview';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Dropdown' },
  meta: metaWith(
    'spartan/ui - Dropdown',
    'Displays a menu to the user — such as a set of actions or functions — triggered by a button.'
  ),
  title: 'spartan/ui - Dropdown',
};
@Component({
  selector: 'spartan-dropdown-menu',
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
    DropdownPreviewComponent,
    DropdownPreviewComponent,
    DropdownWithStatePreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Dropdown"
        lead="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-dropdown-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui-menu" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui-menu" />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
      <h3 class="mt-6 mb-2 ${hlmH4}">Stateful</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-dropdown-with-state />
        </div>
        <spartan-code secondTab [code]="dropdownWithStateCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="input" label="Input" />
        <spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class DropdownPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
  protected readonly dropdownWithStateCode = dropdownWithStateCode;
}
