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
import { CommandPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './command.preview';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { commandDialogCode, CommandDialogComponent } from './command--dialog.example';
import { RouterLink } from '@angular/router';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Command' },
  meta: metaWith('spartan/ui - Command', 'Fast, composable, command menu for Angular.'),
  title: 'spartan/ui - Command',
};

@Component({
  selector: 'spartan-command',
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
    CommandPreviewComponent,
    HlmButtonDirective,
    CommandDialogComponent,
    RouterLink,
    InstallationCsComponent,
  ],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Command" lead="Fast, composable, command menu for Angular." />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-command-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
      <p class="${hlmP}">
        The command primitive is built upon the incredible work of
        <a class="${hlmCode}" href="https://ngneat.github.io/cmdk/" target="_blank">ng-neat/cmdk.</a>
      </p>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
        <spartan-code firstTab language="sh" code="npx nx g @spartan-ng/nx:ui command" />
        <spartan-installation-cs secondTab />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
      <h3 class="mt-6 mb-2 ${hlmH4}">Dialog</h3>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-command-dialog />
        </div>
        <spartan-code secondTab [code]="commandDialogCode" />
      </spartan-tabs>

      <h3 class="mt-6 mb-2 ${hlmH4}">Combobox</h3>
      <p class="${hlmP}">
        You can use the <code class="${hlmCode}">brn-command</code> component as a combobox. See the
        <a hlmBtn class="text-base !px-1" variant="link" routerLink="../combobox">Combobox</a> page for more
        information.
      </p>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="context-menu" label="Context Menu" />
        <spartan-page-bottom-nav-link direction="previous" href="combobox" label="Combobox" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="about" label="About" />
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="examples" label="Examples" />
    </spartan-page-nav>
  `,
})
export default class ComboboxPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
  protected readonly commandDialogCode = commandDialogCode;
}
