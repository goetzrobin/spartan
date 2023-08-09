import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmBadgeDirective } from './helm/src';

type BadgeStory = { isStatic: boolean };
const meta: Meta<BadgeStory> = {
  title: 'Badge',
  decorators: [
    moduleMetadata({
      imports: [HlmBadgeDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<BadgeStory>;

export const Default: Story = {
  args: {
    isStatic: false,
  },
  render: ({ isStatic }) => ({
    props: { isStatic },
    template: `
    <span hlmBadge [static]='isStatic'>I am a badge</span>
    `,
  }),
};

export const Destructive: Story = {
  args: {
    isStatic: false,
  },
  render: ({ isStatic }) => ({
    props: { isStatic },
    template: `
    <span hlmBadge [static]='isStatic' variant='destructive'>I am a destructive badge</span>
    `,
  }),
};

export const Outline: Story = {
  render: () => ({
    template: `
        <span hlmBadge variant='outline'>I am an outlined badge</span>
    `,
  }),
};

export const Secondary: Story = {
  args: {
    isStatic: false,
  },
  render: ({ isStatic }) => ({
    props: { isStatic },
    template: `
            <span hlmBadge [static]='isStatic' variant='secondary'>I am a secondary badge</span>
    `,
  }),
};
