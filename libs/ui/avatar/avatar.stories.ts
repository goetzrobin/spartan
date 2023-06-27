import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from './helm/src';

const meta: Meta<{}> = {
  title: 'Avatar',
  decorators: [
    moduleMetadata({
      imports: [HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
  render: () => ({
    template: `
    <div class="grid w-full items-center gap-4">
    <hlm-avatar variant='small' id="avatar-small">
    <img src='/mountains.jpg' alt='Spartan logo. A red spearhead with the Angular A'  hlmAvatarImage>
      <span class='bg-sky-600 text-sky-50' hlmAvatarFallback>MT</span>
    </hlm-avatar>

     <hlm-avatar variant='medium' id="avatar-medium">
    <img src='/mountains.jpg' alt='Spartan logo. A red spearhead with the Angular A'  hlmAvatarImage>
      <span class='bg-pink-600 text-pink-50' hlmAvatarFallback>MT</span>
    </hlm-avatar>

     <hlm-avatar variant='large' id="avatar-large">
    <img src='/mountains.jpg' alt='Spartan logo. A red spearhead with the Angular A'  hlmAvatarImage>
      <span class='bg-emerald-600 text-emerald-50' hlmAvatarFallback>MT</span>
    </hlm-avatar>
    </div>


`,
  }),
};
