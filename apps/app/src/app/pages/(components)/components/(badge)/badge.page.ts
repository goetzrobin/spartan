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
import { BadgePreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './badge.preview';
import { hlmH4 } from '@spartan-ng/ui/typography/helm';
import { BadgeDestructiveComponent, destructiveCode } from './badge--destructive.example';
import { BadgeOutlineExampleComponent, outlineCode } from './badge--outline.example';
import { BadgeSecondaryExampleComponent, secondaryCode } from './badge--secondary.example';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Badge' },
  meta: metaWith('spartan/ui - Badge', 'Makes a component look like a badge.'),
  title: 'spartan/ui - Badge',
};

@Component({
  selector: 'spartan-badge',
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
    BadgePreviewComponent,
    BadgeDestructiveComponent,
    BadgeOutlineExampleComponent,
    BadgeSecondaryExampleComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Badge" lead="Makes a component look like a badge." />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-badge-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui/badge" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui/badge" />
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
          <spartan-badge-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Secondary</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-badge-secondary />
        </div>
        <spartan-code secondTab [code]="secondaryCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Outline</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-badge-outline />
        </div>
        <spartan-code secondTab [code]="outlineCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Destructive</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-badge-destructive />
        </div>
        <spartan-code secondTab [code]="destructiveCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="button" label="Button" />
        <spartan-page-bottom-nav-link direction="previous" href="avatar" label="Avatar" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class BadgePageComponent {
  readonly defaultCode = defaultCode;
  readonly defaultSkeleton = defaultSkeleton;
  readonly defaultImports = defaultImports;

  readonly secondaryCode = secondaryCode;
  readonly outlineCode = outlineCode;
  readonly destructiveCode = destructiveCode;
}
