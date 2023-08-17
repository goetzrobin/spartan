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
import { defaultCode, defaultImports, defaultSkeleton, DialogPreviewComponent } from './dialog.preview';
import { contextMenuCode, DialogContextMenuPreviewComponent } from './dialog-context-menu.preview';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';
import { InstallationCsComponent } from '~/app/pages/(components)/components/installation-cs.component';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Dialog' },
  meta: metaWith(
    'spartan/ui - Dialog',
    'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.'
  ),
  title: 'spartan/ui - Dialog',
};
@Component({
  selector: 'spartan-dialog',
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
    DialogPreviewComponent,
    DialogPreviewComponent,
    DialogContextMenuPreviewComponent,
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmIconComponent,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    InstallationCsComponent,
  ],
  providers: [provideIcons({ radixExclamationTriangle })],
  template: `
    <section spartanMainSection>
      <spartan-section-intro
        name="Dialog"
        lead="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
      />

      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-dialog-preview />
        </div>
        <spartan-code secondTab [code]="defaultCode" />
      </spartan-tabs>

      <spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
      <spartan-tabs class="mt-4" firstTab="Nx Plugin" secondTab="Manual">
        <spartan-code firstTab language="sh" code="npx nx @spartan-ng/nx:ui dialog" />
        <spartan-installation-cs secondTab />
      </spartan-tabs>

      <spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
      <div class="space-y-4">
        <spartan-code [code]="defaultImports" />
        <spartan-code [code]="defaultSkeleton" />
      </div>

      <spartan-section-sub-heading id="inside-menu">Inside Menu</spartan-section-sub-heading>
      <p class="${hlmP} mb-6">
        You can nest dialogs inside context or dropdown menus. Make sure to wrap the menu-item inside the
        <code class="${hlmCode}">brn-dialog</code> component and apply the
        <code class="${hlmCode}">BrnDialogTrigger</code> directive. Another option is to use the
        <code class="${hlmCode}">brnDialogTriggerFor</code> alternative, which takes in a reference to the brn-dialog.
        That way you can avoid nesting the template.
      </p>
      <div hlmAlert class="mb-6" variant="destructive">
        <hlm-icon name="radixExclamationTriangle" hlmAlertIcon />
        <p hlmAlertTitle>Note</p>
        <p hlmAlertDescription>
          Using brnDialogTriggerFor outside of the current menu seems to close the menu when dismissing the dialog.
        </p>
      </div>
      <spartan-tabs firstTab="Preview" secondTab="Code">
        <div spartanCodePreview firstTab>
          <spartan-dialog-context-menu />
        </div>
        <spartan-code secondTab [code]="contextMenuCode" />
      </spartan-tabs>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
        <spartan-page-bottom-nav-link direction="previous" href="context-menu" label="Context Menu" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="installation" label="Installation" />
      <spartan-page-nav-link fragment="usage" label="Usage" />
      <spartan-page-nav-link fragment="inside-menu" label="Inside Menu" />
    </spartan-page-nav>
  `,
})
export default class DialogPageComponent {
  protected readonly defaultCode = defaultCode;
  protected readonly defaultSkeleton = defaultSkeleton;
  protected readonly defaultImports = defaultImports;
  protected readonly contextMenuCode = contextMenuCode;
}
