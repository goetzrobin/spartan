import { provideIcons } from '@ng-icons/core';
import * as radixIcons from '@ng-icons/radix-icons';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmIconComponent } from './helm/src';

type IconProps = {
  name: string;
  size: number | string;
  color: string;
  strokeWidth: number;
};

const meta: Meta<IconProps> = {
  title: 'Icon',
  decorators: [
    moduleMetadata({
      imports: [HlmIconComponent],
      providers: [provideIcons(radixIcons)],
    }),
  ],
};

export default meta;
type Story = StoryObj<IconProps>;

export const Default: Story = {
  render: ({ name, size, color, strokeWidth }) => ({
    template: `<hlm-icon name="${name}" size="${size}" color="${color}" strokeWidth="${strokeWidth}" />`,
  }),
  args: {
    name: 'radixCheck',
    size: '2rem',
    color: 'red',
    strokeWidth: 1,
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(radixIcons) },
    color: { control: 'color' },
  },
};

export const Tailwind: Story = {
  render: ({ name }) => ({
    template: `<hlm-icon name='${name}' class='text-red-600 text-5xl' />`,
  }),
  args: {
    name: 'radixCheck',
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(radixIcons) },
  },
};
