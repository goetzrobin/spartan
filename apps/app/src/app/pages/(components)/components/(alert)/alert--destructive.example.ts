import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

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
	providers: [provideIcons({ lucideAlertTriangle })],
	template: `
		<div hlmAlert variant="destructive">
			<hlm-icon hlmAlertIcon name="lucideAlertTriangle" />
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
import { lucideAlertTriangle } from '@ng-icons/lucide';

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
  providers: [provideIcons({ lucideAlertTriangle })],
  template: \`
    <div hlmAlert variant="destructive">
      <hlm-icon hlmAlertIcon name="lucideAlertTriangle" />
      <h4 hlmAlertTitle>Unexpected Error</h4>
      <p hlmAlertDesc>Your session has expired. Please log in again.</p>
    </div>
  \`,
})
export class AlertDestructiveComponent {}
`;
