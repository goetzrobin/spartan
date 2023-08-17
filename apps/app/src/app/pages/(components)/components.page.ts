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
    'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn-like styling options.'
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
      class="max-w-[95vw] my-2 mx-auto p-4 rounded-lg text-primary-foreground border border-border bg-primary"
    >
      <hlm-icon hlmAlertIcon name="radixRocket" class="!text-primary-foreground" />
      <h2 hlmAlertTitle>Components are in alpha</h2>
      <p hlmAlertDesc>
        Try them out! We'd love to hear your feedback! Expect breaking changes!
        <a class="underline" target="_blank" href="https://github.com/goetzrobin/spartan"
          >Become the one making those changes on GitHub!</a
        >
      </p>
    </div>
    <spartan-page />
  `,
})
export default class ComponentsPageComponent {}
