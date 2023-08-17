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
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { defaultCode, defaultImports, defaultSkeleton, TogglePreviewComponent } from './toggle.preview';
import { disabledCode, ToggleDisabledPreviewComponent } from './toggle--disabled.preview';
import { largeCode, ToggleLargePreviewComponent } from './toggle--large.preview';
import { outlineCode, ToggleOutlinePreviewComponent } from './toggle--outline.preview';
import { smallCode, ToggleSmallPreviewComponent } from './toggle--small.preview';
import { ToggleWithTextPreviewComponent, withTextCode } from './toggle--with-text.preview';
import { PageBottomNavPlaceholderComponent } from '~/app/shared/layout/page-bottom-nav-placeholder.component';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Toggle' },
  meta: metaWith('spartan/ui - Toggle', 'A two-state button that can be either on or off.'),
  title: 'spartan/ui - Toggle',
};
@Component({
  selector: 'spartan-input',
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
    TogglePreviewComponent,
    ToggleDisabledPreviewComponent,
    ToggleLargePreviewComponent,
    ToggleOutlinePreviewComponent,
    ToggleSmallPreviewComponent,
    ToggleWithTextPreviewComponent,
    PageBottomNavPlaceholderComponent,
    InstallationCsComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Toggle" lead="A two-state button that can be either on or off." />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
        <spartan-code firstTab language="sh" code="npx nx g @spartan-ng/nx:ui toggle" />
        <spartan-installation-cs secondTab />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
      <h3 class="mt-6 mb-2 ${hlmH4}">Default</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Outline</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-outline />
        </div>
        <spartan-code secondTab [code]="outlineCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">With Text</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-with-text />
        </div>
        <spartan-code secondTab [code]="withTextCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Small</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-small />
        </div>
        <spartan-code secondTab [code]="smallCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Large</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-large />
        </div>
        <spartan-code secondTab [code]="largeCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Disabled</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-toggle-disabled />
        </div>
        <spartan-code secondTab [code]="disabledCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-placeholder />
        <spartan-page-bottom-nav-link direction="previous" href="textarea" label="Textarea" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class TogglePageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
  protected readonly disabledCode = disabledCode;
  protected readonly largeCode = largeCode;
  protected readonly outlineCode = outlineCode;
  protected readonly smallCode = smallCode;
  protected readonly withTextCode = withTextCode;
}
