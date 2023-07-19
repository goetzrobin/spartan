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
import { ButtonPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './button.preview';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { ButtonDestructiveComponent, destructiveCode } from './button--destructive.example';
import { ButtonOutlineComponent, outlineCode } from './button--outline.example';
import { ButtonSecondaryComponent, secondaryCode } from './button--secondary.example';
import { ButtonGhostComponent, ghostCode } from './button--ghost.example';
import { ButtonLinkComponent, linkCode } from './button--link.example';
import { ButtonIconComponent, iconCode } from './button--icon.example';
import {
  ButtonWithIconComponent,
  withIconCode,
} from '~/app/pages/(components)/components/(button)/button--with-icon.example';
import {
  ButtonLoadingComponent,
  loadingCode,
} from '~/app/pages/(components)/components/(button)/button--loading.example';
import { anchorCode, ButtonAnchorComponent } from '~/app/pages/(components)/components/(button)/button--anchor.example';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Button' },
  meta: metaWith('spartan/ui - Button', 'Displays a button or a component that looks like a button.'),
  title: 'spartan/ui - Button',
};

@Component({
  selector: 'spartan-button',
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
    ButtonPreviewComponent,
    ButtonDestructiveComponent,
    ButtonOutlineComponent,
    ButtonSecondaryComponent,
    ButtonGhostComponent,
    ButtonLinkComponent,
    ButtonIconComponent,
    ButtonWithIconComponent,
    ButtonLoadingComponent,
    ButtonAnchorComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Button" lead="Displays a callout for user attention." />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="yarn" secondTab="npm">
        <spartan-code firstTab language="sh" code="yarn install @spartan-ng/ui-button" />
        <spartan-code secondTab language="sh" code="npm install @spartan-ng/ui-button" />
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
          <spartan-button-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Secondary</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-secondary />
        </div>
        <spartan-code secondTab [code]="secondaryCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Destructive</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-destructive />
        </div>
        <spartan-code secondTab [code]="destructiveCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Outline</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-outline />
        </div>
        <spartan-code secondTab [code]="outlineCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Ghost</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-ghost />
        </div>
        <spartan-code secondTab [code]="ghostCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Link</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-link />
        </div>
        <spartan-code secondTab [code]="linkCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Icon</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-icon />
        </div>
        <spartan-code secondTab [code]="iconCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">With Icon</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-with-icon />
        </div>
        <spartan-code secondTab [code]="withIconCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">Loading</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-loading />
        </div>
        <spartan-code secondTab [code]="loadingCode" />
      </spartan-tabs>
      <h3 class="mt-6 mb-2 ${hlmH4}">As Anchor</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-button-anchor />
        </div>
        <spartan-code secondTab [code]="anchorCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="card" label="Card" />
        <spartan-page-bottom-nav-link direction="previous" href="avatar" label="Badge" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class ButtonPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;

  protected readonly secondaryCode = secondaryCode;
  protected readonly outlineCode = outlineCode;
  protected readonly destructiveCode = destructiveCode;
  protected readonly ghostCode = ghostCode;
  protected readonly linkCode = linkCode;
  protected readonly iconCode = iconCode;
  protected readonly withIconCode = withIconCode;
  protected readonly loadingCode = loadingCode;
  protected readonly anchorCode = anchorCode;
}
