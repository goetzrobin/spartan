import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmButtonDirective } from './helm/src';

const meta: Meta<{}> = {
  title: 'Button',
  decorators: [
    moduleMetadata({
      imports: [HlmButtonDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button hlmBtn>Click me</button>
        <button hlmBtn size='lg'>Large Click me</button>
        <button hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};

export const Destructive: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button variant='destructive' hlmBtn>Click me</button>
        <button variant='destructive' hlmBtn size='lg'>Large Click me</button>
        <button variant='destructive' hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};

export const Outline: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button variant='outline' hlmBtn>Click me</button>
        <button variant='outline' hlmBtn size='lg'>Large Click me</button>
        <button variant='outline' hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};

export const Secondary: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button variant='secondary' hlmBtn>Click me</button>
        <button variant='secondary' hlmBtn size='lg'>Large Click me</button>
        <button variant='secondary' hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};

export const Ghost: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button variant='ghost' hlmBtn>Click me</button>
        <button variant='ghost' hlmBtn size='lg'>Large Click me</button>
        <button variant='ghost' hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};

export const Link: Story = {
  render: () => ({
    template: `
    <div class='flex space-x-3'>
        <button variant='link' hlmBtn>Click me</button>
        <button variant='link' hlmBtn size='lg'>Large Click me</button>
        <button variant='link' hlmBtn size='sm'>Small Click me</button>
    </div>
    `,
  }),
};
