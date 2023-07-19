import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-destructive',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixExclamationTriangle })],
  template: `
    <div hlmAlert variant="destructive">
      <hlm-icon hlmAlertIcon name="radixExclamationTriangle" />
      <h4 hlmAlertTitle>Unexpected Error</h4>
      <p hlmAlertDesc>Your session has expired. Please log in again.</p>
    </div>
  `,
})
export class AlertDestructiveComponent {}

export const destructiveCode = `
import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-alert-destructive',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconComponent,
  ],
  providers: [provideIcons({ radixExclamationTriangle })],
  template: \`
    <div hlmAlert variant="destructive">
      <hlm-icon hlmAlertIcon name="radixExclamationTriangle" />
      <h4 hlmAlertTitle>Unexpected Error</h4>
      <p hlmAlertDesc>Your session has expired. Please log in again.</p>
    </div>
  \`,
})
export class AlertDestructiveComponent {}
`;
