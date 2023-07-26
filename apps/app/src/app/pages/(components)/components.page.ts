import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { PageComponent } from '~/app/shared/layout/page.component';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixRocket } from '@ng-icons/radix-icons';

export const routeMeta: RouteMeta = {
  meta: metaWith(
    'spartan/ui - Components',
    'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn like styling options.'
  ),
  data: {
    breadcrumb: 'Components',
  },
  title: 'spartan/ui - Components',
};

@Component({
  selector: 'spartan-components',
  standalone: true,
  imports: [
    PageComponent,
    HlmAlertDirective,
    HlmAlertTitleDirective,
    HlmAlertDescriptionDirective,
    HlmIconComponent,
    HlmAlertIconDirective,
  ],
  providers: [provideIcons({ radixRocket })],
  template: `
    <div
      hlmAlert
      class="max-w-[95vw] my-2 mx-auto p-4 rounded-lg text-destructive-foreground border border-border bg-destructive"
    >
      <hlm-icon hlmAlertIcon name="radixRocket" class="!text-destructive-foreground" />
      <h2 hlmAlertTitle>Components are coming soon...</h2>
      <p hlmAlertDesc>
        We are actively working on publishing these components. They will soon be released.
        <a class="underline" target="_blank" href="https://github.com/goetzrobin/spartan">Star us on GitHub</a> and
        follow along as we build the next Angular UI library. Check out the preview below to see what they'll look like:
      </p>
    </div>
    <spartan-page />
  `,
})
export default class ComponentsPageComponent {}
