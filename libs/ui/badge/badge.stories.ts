import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmBadgeDirective } from './helm/src';

const meta: Meta<{}> = {
  title: 'Badge',
  decorators: [
    moduleMetadata({
      imports: [HlmBadgeDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <span hlmBadge>I am a badge</span>
    `,
  }),
};

export const Destructive: Story = {
  render: () => ({
    template: `
    <span hlmBadge variant='destructive'>I am a destructive badge</span>
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
  render: () => ({
    template: `
            <span hlmBadge variant='secondary'>I am a secondary badge</span>
    `,
  }),
};
