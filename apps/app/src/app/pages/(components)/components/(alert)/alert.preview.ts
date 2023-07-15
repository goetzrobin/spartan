import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@ng-spartan/ui/alert/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCube } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-preview',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCube })],
  template: `
    <div hlmAlert>
      <hlm-icon hlmAlertIcon name="radixCube" />
      <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
      <p hlmAlertDesc>
        spartan/ui is made up of unstyled ui providers, the spartan/ui/brain.<br />
        On top we add spartan/ui/helm(et) with shadcn-like styles.
      </p>
    </div>
  `,
})
export class AlertPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@ng-spartan/ui/alert/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCube } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-preview',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixCube })],
  template: \`
    <div hlmAlert>
      <hlm-icon hlmAlertIcon name="radixCube" />
      <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
      <p hlmAlertDesc>
        spartan/ui is made up of unstyled ui providers, the spartan/ui/brain.<br />
        On top we add spartan/ui/helm(et) with shadcn-like styles.
      </p>
    </div>
  \`,
})
export class AlertPreviewComponent {}
`;

export const defaultImports = `
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@ng-spartan/ui/alert/helm';
`;

export const defaultSkeleton = `
    <div hlmAlert>
      <hlm-icon hlmAlertIcon name="radixCube" />
      <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
      <p hlmAlertDesc>
        spartan/ui is made up of unstyled ui providers, the spartan/ui/brain.<br />
        On top we add spartan/ui/helm(et) with shadcn-like styles.
      </p>
    </div>
`;
