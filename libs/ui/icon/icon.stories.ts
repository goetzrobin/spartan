import * as radixIcons from '@ng-icons/radix-icons';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from './helm/src';

type IconProps = {
  name: string;
  size: string;
  color: string;
  strokeWidth: number;
  className: string;
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
  render: ({ name, size, color, strokeWidth, className }) => ({
    template: `<hlm-icon class="${className}" name="${name}" size="${size}" color="${color}" strokeWidth="${strokeWidth}" />`,
  }),
  args: {
    name: 'radixCheck',
    size: 'sm',
    color: 'red',
    className: '',
    strokeWidth: 1,
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'base', 'lg', 'xl', 'none', '2rem', '25px', '10'] },
    name: { control: 'select', options: Object.keys(radixIcons) },
    color: { control: 'color' },
  },
};

export const Tailwind: Story = {
  render: ({ name, className }) => ({
    template: `<hlm-icon name='${name}' class='${className}' />`,
  }),
  args: {
    className: 'text-red-600 text-5xl',
    name: 'radixCheck',
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(radixIcons) },
  },
};
