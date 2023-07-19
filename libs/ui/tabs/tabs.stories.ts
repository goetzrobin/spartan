import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { BrnTabsComponent, BrnTabsContentDirective, BrnTabsListComponent, BrnTabsTriggerDirective } from './brain/src';
import { HlmTabsContentDirective, HlmTabsListDirective, HlmTabsTriggerDirective } from './helm/src';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '../card/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmBadgeDirective } from '../badge/helm/src';

export type TabsStory = { activationMode: 'manual' | 'automatic' };
const meta: Meta<TabsStory> = {
  argTypes: {
    activationMode: {
      options: ['manual', 'automatic'],
      control: {
        type: 'select',
      },
    },
  },
  title: 'Tabs',
  decorators: [
    moduleMetadata({
      imports: [
        BrnTabsComponent,
        BrnTabsListComponent,
        BrnTabsTriggerDirective,
        BrnTabsContentDirective,

        HlmTabsListDirective,
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
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<TabsStory>;
export const Default: Story = {
  args: {
    activationMode: 'automatic',
  },
  render: ({ activationMode }) => ({
    props: { activationMode },
    template: `
  <brn-tabs [activationMode]='activationMode' class='block max-w-3xl mx-auto' value='account'>
    <brn-tabs-list hlmTabsList class='grid w-full grid-cols-2' aria-label='tabs example'>
      <button hlmTabsTrigger brnTabsTrigger='account'>Account</button>
      <button hlmTabsTrigger brnTabsTrigger='password'>Password</button>
    </brn-tabs-list>
    <div hlmTabsContent brnTabsContent='account'>
     <section hlmCard>
       <div hlmCardHeader>
        <h3 hlmCardTitle>Account</h3>
        <p hlmCardDescription>
         Make changes to your account here. Click save when you're done.
        </p>
      </div>
      <p hlmCardContent>
       <label class='block my-4' hlmLabel>Name
       <input class='w-full mt-1.5' value='Pedro Duarte' hlmInput>
       </label>
         <label class='block my-4' hlmLabel>Username
       <input class='w-full mt-1.5' placeholder='@peduarte' hlmInput>
       </label>
      </p>
      <div hlmCardFooter>
        <button hlmBtn>Save Changes</button>
      </div>
    </section>
    </div>
    <div hlmTabsContent brnTabsContent='password'>
    <section hlmCard>
       <div hlmCardHeader>
        <h3 hlmCardTitle>Password</h3>
        <p hlmCardDescription>
        Change your password here. After saving, you'll be logged out.
        </p>
      </div>
      <p hlmCardContent>
          <label class='block my-4' hlmLabel>Old Password
       <input class='w-full mt-1.5' type='password' hlmInput>
       </label>
         <label class='block my-4' hlmLabel>New Password
       <input class='w-full mt-1.5' type='password' hlmInput>
       </label>
      </p>
      <div hlmCardFooter>
        <button hlmBtn>Save Password</button>
      </div>
    </section>
</div>
  </brn-tabs>
`,
  }),
};

export const Vertical: Story = {
  args: {
    activationMode: 'automatic',
  },
  render: ({ activationMode }) => ({
    props: { activationMode },
    template: `
        <brn-tabs class='flex flex-row space-x-2 max-w-3xl mx-auto' orientation='vertical'
              value='account'>
      <brn-tabs-list hlmTabsList orientation='vertical' aria-label='tabs example'>
        <button class='w-full' hlmTabsTrigger brnTabsTrigger='account'>Account</button>
        <button class='w-full' hlmTabsTrigger brnTabsTrigger='password'>Password</button>
        <button class='w-full' hlmTabsTrigger brnTabsTrigger='danger'>Danger Zone</button>
      </brn-tabs-list>
      <div hlmTabsContent brnTabsContent='account'>
        <section hlmCard>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Account</h3>
            <p hlmCardDescription>
              Make changes to your account here. Click save when you're done.
            </p>
          </div>
          <p hlmCardContent>
            <label class='block my-4' hlmLabel>Name
              <input class='w-full mt-1.5' value='Pedro Duarte' hlmInput>
            </label>
            <label class='block my-4' hlmLabel>Username
              <input class='w-full mt-1.5' placeholder='@peduarte' hlmInput>
            </label>
          </p>
          <div hlmCardFooter>
            <button hlmBtn>Save Changes</button>
          </div>
        </section>
      </div>
      <div hlmTabsContent brnTabsContent='password'>
        <section hlmCard>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Password</h3>
            <p hlmCardDescription>
              Change your password here. After saving, you'll be logged out.
            </p>
          </div>
          <p hlmCardContent>
            <label class='block my-4' hlmLabel>Old Password
              <input class='w-full mt-1.5' type='password' hlmInput>
            </label>
            <label class='block my-4' hlmLabel>New Password
              <input class='w-full mt-1.5' type='password' hlmInput>
            </label>
          </p>
          <div hlmCardFooter>
            <button hlmBtn>Save Password</button>
          </div>
        </section>
      </div>
      <div hlmTabsContent brnTabsContent='danger'>
        <section hlmCard>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Delete Account</h3>
            <p hlmCardDescription>
              Are you sure you want to delete your account? You cannot undo this action.
            </p>
          </div>
          <div hlmCardFooter>
            <button variant='destructive' hlmBtn>Delete Account</button>
          </div>
        </section>
      </div>
    </brn-tabs>
`,
  }),
};
