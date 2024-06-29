import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
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
	selector: 'spartan-tabs-example-vertical',
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
		HlmBadgeDirective,

		FormsModule,
		BrnRadioGroupComponent,
		BrnRadioComponent,
		HlmRadioIndicatorComponent,
		HlmRadioDirective,
		HlmRadioGroupDirective,
		HlmSmallDirective,
	],
	host: {
		class: 'block w-full max-w-lg min-h-[400px]',
	},
	template: `
		<hlm-tabs tab="profile" class="mx-auto flex max-w-3xl flex-row space-x-2" orientation="vertical">
			<hlm-tabs-list orientation="vertical" aria-label="tabs example">
				<button class="w-full" hlmTabsTrigger="profile">Profile</button>
				<button class="w-full" hlmTabsTrigger="notifications">Notifications</button>
				<button class="w-full" hlmTabsTrigger="security">Security</button>
			</hlm-tabs-list>
			<div hlmTabsContent="profile">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Profile</h3>
						<p hlmCardDescription>Update your profile information. Click save when you're done.</p>
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
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Profile</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="notifications">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Notifications</h3>
						<p hlmCardDescription>Manage your notification preferences.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>Email Notifications</label>
						<brn-radio-group class="mb-4 space-y-1 font-mono text-sm font-medium" hlm [(ngModel)]="email">
							<brn-radio hlm value="">
								<hlm-radio-indicator indicator />
								Enabled
							</brn-radio>
							<brn-radio hlm value="">
								<hlm-radio-indicator indicator />
								Disabled
							</brn-radio>
						</brn-radio-group>
						<label class="my-4 block" hlmLabel>SMS Notifications</label>
						<brn-radio-group class="mb-4 space-y-1 font-mono text-sm font-medium" hlm [(ngModel)]="sms">
							<brn-radio hlm value="">
								<hlm-radio-indicator indicator />
								Enabled
							</brn-radio>
							<brn-radio hlm value="">
								<hlm-radio-indicator indicator />
								Disabled
							</brn-radio>
						</brn-radio-group>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Notifications</button>
					</div>
				</section>
			</div>
			<div hlmTabsContent="security">
				<section hlmCard>
					<div hlmCardHeader>
						<h3 hlmCardTitle>Security</h3>
						<p hlmCardDescription>Manage your security settings.</p>
					</div>
					<p hlmCardContent>
						<label class="my-4 block" hlmLabel>
							Old Password
							<input class="w-80" hlmInput placeholder="Password" type="password" />
						</label>
						<label class="my-4 block" hlmLabel>
							New Password
							<input class="w-80" hlmInput placeholder="Password" type="password" />
						</label>
					</p>
					<div hlmCardFooter>
						<button hlmBtn>Save Password</button>
					</div>
					<hr class="my-4" />
					<div hlmCardFooter>
						<button variant="destructive" hlmBtn>Delete Account</button>
					</div>
				</section>
			</div>
		</hlm-tabs>
	`,
})
export class TabsVerticalExamplePageComponent {
	email: boolean = false;
	sms: boolean = false;
}
