import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmCardImports } from '../card/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { BrnTabsDirective, BrnTabsImports } from './brain/src';
import { HlmTabsImports } from './helm/src';

const meta: Meta<BrnTabsDirective> = {
	title: 'Tabs',
	component: BrnTabsDirective,
	tags: ['autodocs'],
	argTypes: {
		activationMode: {
			options: ['manual', 'automatic'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [
				BrnTabsImports,
				HlmTabsImports,
				HlmCardImports,

				HlmLabelDirective,
				HlmInputDirective,
				HlmButtonDirective,
			],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnTabsDirective>;
export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-tabs tab="account" ${argsToTemplate(args)} class="mx-auto block max-w-3xl">
				<hlm-tabs-list class="grid w-full grid-cols-2" aria-label="tabs example">
					<button hlmTabsTrigger="account">Account</button>
					<button hlmTabsTrigger="password">Password</button>
				</hlm-tabs-list>
				<div hlmTabsContent="account">
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Account</h3>
							<p hlmCardDescription>Make changes to your account here. Click save when you're done.</p>
						</div>
						<p hlmCardContent>
							<label class="my-4 block" hlmLabel>
								Name
								<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
							</label>
							<label class="my-4 block" hlmLabel>
								Username
								<input class="mt-1.5 w-full" placeholder="@peduarte" hlmInput />
							</label>
						</p>
						<div hlmCardFooter>
							<button hlmBtn>Save Changes</button>
						</div>
					</section>
				</div>
				<div hlmTabsContent="password">
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Password</h3>
							<p hlmCardDescription>Change your password here. After saving, you'll be logged out.</p>
						</div>
						<p hlmCardContent>
							<label class="my-4 block" hlmLabel>
								Old Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
							<label class="my-4 block" hlmLabel>
								New Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
						</p>
						<div hlmCardFooter>
							<button hlmBtn>Save Password</button>
						</div>
					</section>
				</div>
			</hlm-tabs>
		`,
	}),
};

export const Vertical: Story = {
	render: ({ activationMode }) => ({
		props: { activationMode },
		template: /* HTML */ `
			<hlm-tabs tab="account" class="mx-auto flex max-w-3xl flex-row space-x-2" orientation="vertical">
				<hlm-tabs-list orientation="vertical" aria-label="tabs example">
					<button class="w-full" hlmTabsTrigger="account">Account</button>
					<button class="w-full" hlmTabsTrigger="password">Password</button>
					<button class="w-full" hlmTabsTrigger="danger">Danger Zone</button>
				</hlm-tabs-list>
				<div hlmTabsContent="account">
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Account</h3>
							<p hlmCardDescription>Make changes to your account here. Click save when you're done.</p>
						</div>
						<p hlmCardContent>
							<label class="my-4 block" hlmLabel>
								Name
								<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
							</label>
							<label class="my-4 block" hlmLabel>
								Username
								<input class="mt-1.5 w-full" placeholder="@peduarte" hlmInput />
							</label>
						</p>
						<div hlmCardFooter>
							<button hlmBtn>Save Changes</button>
						</div>
					</section>
				</div>
				<div hlmTabsContent="password">
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Password</h3>
							<p hlmCardDescription>Change your password here. After saving, you'll be logged out.</p>
						</div>
						<p hlmCardContent>
							<label class="my-4 block" hlmLabel>
								Old Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
							<label class="my-4 block" hlmLabel>
								New Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
						</p>
						<div hlmCardFooter>
							<button hlmBtn>Save Password</button>
						</div>
					</section>
				</div>
				<div hlmTabsContent="danger">
					<section hlmCard>
						<div hlmCardHeader>
							<h3 hlmCardTitle>Delete Account</h3>
							<p hlmCardDescription>Are you sure you want to delete your account? You cannot undo this action.</p>
						</div>
						<div hlmCardFooter>
							<button variant="destructive" hlmBtn>Delete Account</button>
						</div>
					</section>
				</div>
			</hlm-tabs>
		`,
	}),
};

export const BrnOnly: Story = {
	render: () => ({
		props: { activationMode: 'automatic' },
		template: /* HTML */ `
			<div brnTabs="account" [activationMode]="activationMode" class="mx-auto block max-w-3xl">
				<div brnTabsList class="grid w-full grid-cols-2" aria-label="tabs example">
					<button brnTabsTrigger="account">Account</button>
					<button brnTabsTrigger="password">Password</button>
				</div>
				<div brnTabsContent="account">Account content</div>
				<div brnTabsContent="password">Password content</div>
			</div>
		`,
	}),
};
