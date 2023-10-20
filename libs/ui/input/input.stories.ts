import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmInputDirective } from './helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmButtonDirective } from '../button/helm/src';

const meta: Meta<{}> = {
  title: 'Input',
  decorators: [
    moduleMetadata({
      imports: [HlmInputDirective, HlmLabelDirective, HlmButtonDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email'/>
    `,
  }),
};

export const File: Story = {
  render: () => ({
    template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label hlmLabel for="picture">Picture</label>
      <input class='w-80' hlmInput id="picture" type="file" />
    </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
    <input aria-label='Email' disabled class='w-80' hlmInput type='email' placeholder='Email'/>
    `,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `
    <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email' error/>
    `,
  }),
};

export const WithButton: Story = {
  name: 'With Button',
  render: () => ({
    template: `
    <div class="flex w-full max-w-sm items-center space-x-2">
    <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email'/>
    <button hlmBtn>Subscribe</button>
    </div>
    `,
  }),
};
