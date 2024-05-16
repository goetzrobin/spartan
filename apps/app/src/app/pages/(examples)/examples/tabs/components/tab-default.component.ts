import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnRadioComponent, BrnRadioGroupComponent } from '@spartan-ng/ui-radiogroup-brain';
import { HlmRadioDirective, HlmRadioGroupDirective, HlmRadioIndicatorComponent } from '@spartan-ng/ui-radiogroup-helm';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';
import { HlmSmallDirective } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-tabs-default-example-preview',
	standalone: true,
	imports: [
		HlmTabsComponent,
		HlmTabsListComponent,
		HlmTabsTriggerDirective,
		HlmTabsContentDirective,

		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,

		HlmLabelDirective,
		HlmInputDirective,
		HlmButtonDirective,

		FormsModule,
		BrnRadioGroupComponent,
		BrnRadioComponent,
		HlmRadioIndicatorComponent,
		HlmRadioDirective,
		HlmRadioGroupDirective,
		HlmSmallDirective,
	],
	host: {
		class: 'block w-full max-w-lg',
	},
	template: `
		<hlm-tabs tab="profile" class="w-full">
			<hlm-tabs-list class="grid w-full grid-cols-2" aria-label="tabs example">
				<button hlmTabsTrigger="profile">Profile</button>
				<button hlmTabsTrigger="settings">Settings</button>
			</hlm-tabs-list>
			<div hlmTabsContent="profile">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Profile</h3>
						<p hlmCardDescription>Update your profile information here. Click save when you're done.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							Full Name
							<input class="mt-1.5 w-full" value="Alex Johnson" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							Email
							<input class="mt-1.5 w-full" placeholder="alex.johnson@example.com" hlmInput />
						</label>
						<label class="my-4 block" hlmLabel>
							Bio
							<textarea
								class="min-h-[80px] w-full"
								hlmInput
								placeholder="Tell us a little about yourself...."
							></textarea>
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Profile</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="settings">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Settings</h3>
						<p hlmCardDescription>Adjust your settings here. Click save when you're done.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>Notification Preferences</label>
						<brn-radio-group class="mb-4 space-y-1 font-mono text-sm font-medium" hlm [(ngModel)]="notifications">
							<brn-radio hlm value="email">
								<hlm-radio-indicator indicator />
								Email Notifications
							</brn-radio>
							<brn-radio hlm value="sms">
								<hlm-radio-indicator indicator />
								SMS Notifications
							</brn-radio>
							<brn-radio hlm value="push">
								<hlm-radio-indicator indicator />
								Push Notifications
							</brn-radio>
						</brn-radio-group>
						<label class="my-4 block" hlmLabel>Language</label>
						<brn-radio-group class="mb-4 space-y-1 font-mono text-sm font-medium" hlm [(ngModel)]="language">
							<brn-radio hlm value="english">
								<hlm-radio-indicator indicator />
								English
							</brn-radio>
							<brn-radio hlm value="spanish">
								<hlm-radio-indicator indicator />
								Spanish
							</brn-radio>
							<brn-radio hlm value="french">
								<hlm-radio-indicator indicator />
								French
							</brn-radio>
							<brn-radio disabled hlm value="german">
								<hlm-radio-indicator indicator />
								German
							</brn-radio>
						</brn-radio-group>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Settings</button>
					</div>
				</section>
			</div>
		</hlm-tabs>
	`,
})
export class TabsDefaultExamplePageComponent {
	notifications: string | null = 'push';
	language: string | null = 'english';
}
