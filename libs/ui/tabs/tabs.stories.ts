import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
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
			<hlm-tabs tab="account" ${argsToTemplate(args)} class="block max-w-3xl mx-auto">
				<hlm-tabs-list class="w-full grid grid-cols-2" aria-label="tabs example">
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
							<label class="block my-4" hlmLabel>
								Name
								<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
							</label>
							<label class="block my-4" hlmLabel>
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
							<label class="block my-4" hlmLabel>
								Old Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
							<label class="block my-4" hlmLabel>
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
			<hlm-tabs tab="account" class="flex flex-row max-w-3xl mx-auto space-x-2" orientation="vertical">
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
							<label class="block my-4" hlmLabel>
								Name
								<input class="mt-1.5 w-full" value="Pedro Duarte" hlmInput />
							</label>
							<label class="block my-4" hlmLabel>
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
							<label class="block my-4" hlmLabel>
								Old Password
								<input class="mt-1.5 w-full" type="password" hlmInput />
							</label>
							<label class="block my-4" hlmLabel>
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

export const Paginated: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-tabs tab="1" class="mx-auto block max-w-3xl">
				<hlm-paginated-tabs-list>
					<button hlmTabsTrigger="1">Tab 1</button>
					<button hlmTabsTrigger="2">Tab 2</button>
					<button hlmTabsTrigger="3">Tab 3</button>
					<button hlmTabsTrigger="4">Tab 4</button>
					<button hlmTabsTrigger="5">Tab 5</button>
					<button hlmTabsTrigger="6">Tab 6</button>
					<button hlmTabsTrigger="7">Tab 7</button>
					<button hlmTabsTrigger="8">Tab 8</button>
					<button hlmTabsTrigger="9">Tab 9</button>
					<button hlmTabsTrigger="10">Tab 10</button>
					<button hlmTabsTrigger="11">Tab 11</button>
					<button hlmTabsTrigger="12">Tab 12</button>
					<button hlmTabsTrigger="13">Tab 13</button>
					<button hlmTabsTrigger="14">Tab 14</button>
					<button hlmTabsTrigger="15">Tab 15</button>
					<button hlmTabsTrigger="16">Tab 16</button>
					<button hlmTabsTrigger="17">Tab 17</button>
					<button hlmTabsTrigger="18">Tab 18</button>
					<button hlmTabsTrigger="19">Tab 19</button>
					<button hlmTabsTrigger="20">Tab 20</button>
				</hlm-paginated-tabs-list>
				<div hlmTabsContent="1">Tab 1</div>
				<div hlmTabsContent="2">Tab 2</div>
				<div hlmTabsContent="3">Tab 3</div>
				<div hlmTabsContent="4">Tab 4</div>
				<div hlmTabsContent="5">Tab 5</div>
				<div hlmTabsContent="6">Tab 6</div>
				<div hlmTabsContent="7">Tab 7</div>
				<div hlmTabsContent="8">Tab 8</div>
				<div hlmTabsContent="9">Tab 9</div>
				<div hlmTabsContent="10">Tab 10</div>
				<div hlmTabsContent="11">Tab 11</div>
				<div hlmTabsContent="12">Tab 12</div>
				<div hlmTabsContent="13">Tab 13</div>
				<div hlmTabsContent="14">Tab 14</div>
				<div hlmTabsContent="15">Tab 15</div>
				<div hlmTabsContent="16">Tab 16</div>
				<div hlmTabsContent="17">Tab 17</div>
				<div hlmTabsContent="18">Tab 18</div>
				<div hlmTabsContent="19">Tab 19</div>
				<div hlmTabsContent="20">Tab 20</div>
			</hlm-tabs>
		`,
	}),
};

export const BrnOnly: Story = {
	render: () => ({
		props: { activationMode: 'automatic' },
		template: /* HTML */ `
			<div brnTabs="account" [activationMode]="activationMode" class="block max-w-3xl mx-auto">
				<div brnTabsList class="w-full grid grid-cols-2" [attr.aria-label]="'tabs example'">
					<button brnTabsTrigger="account">Account</button>
					<button brnTabsTrigger="password">Password</button>
				</div>
				<div brnTabsContent="account">Account content</div>
				<div brnTabsContent="password">Password content</div>
			</div>
		`,
	}),
};
