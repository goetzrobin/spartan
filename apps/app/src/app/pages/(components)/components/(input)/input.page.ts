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
import { defaultCode, defaultImports, defaultSkeleton, InputPreviewComponent } from './input.preview';
import { hlmH4 } from '@ng-spartan/ui/typography/helm';
import { fileCode, InputFilePreviewComponent } from '~/app/pages/(components)/components/(input)/input--file.preview';
import { disabledCode, InputDisabledPreviewComponent } from './input--disabled.preview';
import { InputLabelPreviewComponent, labelCode } from './input--label.preview';
import { buttonCode, InputButtonPreviewComponent } from './input--button.preview';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Input' },
  meta: metaWith(
    'spartan/ui - Input',
    'Gives an input field or a component a distinct look that indicates its input capabilities.'
  ),
  title: 'spartan/ui - Input',
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
    InputPreviewComponent,
    InputFilePreviewComponent,
    InputDisabledPreviewComponent,
    InputLabelPreviewComponent,
    InputButtonPreviewComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Input"
        lead="Gives an input field or a component a distinct look that indicates its input capabilities"
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-input-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan.ng/ui/input" />
        <spartan-code secondTab language="sh" code="npm install @spartan.ng/ui/input" />
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
          <spartan-input-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">File</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-input-file />
        </div>
        <spartan-code secondTab [code]="fileCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Disabled</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-input-disabled />
        </div>
        <spartan-code secondTab [code]="disabledCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">With Label</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-input-label />
        </div>
        <spartan-code secondTab [code]="labelCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">With Button</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-input-button />
        </div>
        <spartan-code secondTab [code]="buttonCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="label" label="Label" />
        <spartan-page-bottom-nav-link direction="previous" href="dropdown-menu" label="Dropdown" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class InputPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
  protected readonly fileCode = fileCode;
  protected readonly disabledCode = disabledCode;
  protected readonly labelCode = labelCode;
  protected readonly buttonCode = buttonCode;
}
