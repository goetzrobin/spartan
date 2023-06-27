import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmToggleDirective } from './helm/src';
import { BrnToggleDirective } from './brain/src';

const meta: Meta<{}> = {
  title: 'Toggle',
  decorators: [
    moduleMetadata({
      imports: [HlmToggleDirective, BrnToggleDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;
const ItalicIcon = `<svg class='h-4 w-4' viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.67494 3.50017C5.67494 3.25164 5.87641 3.05017 6.12494 3.05017H10.6249C10.8735 3.05017 11.0749 3.25164 11.0749 3.50017C11.0749 3.7487 10.8735 3.95017 10.6249 3.95017H9.00587L7.2309 11.05H8.87493C9.12345 11.05 9.32493 11.2515 9.32493 11.5C9.32493 11.7486 9.12345 11.95 8.87493 11.95H4.37493C4.1264 11.95 3.92493 11.7486 3.92493 11.5C3.92493 11.2515 4.1264 11.05 4.37493 11.05H5.99397L7.76894 3.95017H6.12494C5.87641 3.95017 5.67494 3.7487 5.67494 3.50017Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;

export const Default: Story = {
  render: () => ({
    template: `
    <div class='space-x-3'>
    <button aria-label='Italic Toggle' size='sm' hlmToggle>${ItalicIcon}</button>
    <button aria-label='Italic Toggle' hlmToggle>${ItalicIcon}</button>
    <button aria-label='Italic Toggle' size='lg' hlmToggle>${ItalicIcon}</button>
    <button aria-label='Italic Toggle' variant='outline' hlmToggle>${ItalicIcon}</button>
    <button aria-label='Italic Toggle' disabled hlmToggle>${ItalicIcon}</button>
    </div>
    `,
  }),
};

export const WithText: Story = {
  name: 'With Text',
  render: () => ({
    template: `
    <div class='space-x-3'>
    <button size='sm' hlmToggle>${ItalicIcon} <span class='ml-2'>Italic</span></button>
    <button hlmToggle>${ItalicIcon} <span class='ml-2'>Italic</span></button>
    <button size='lg' hlmToggle>${ItalicIcon} <span class='ml-2'>Italic</span></button>
    <button variant='outline' hlmToggle>${ItalicIcon} <span class='ml-2'>Italic</span></button>
    <button disabled hlmToggle>${ItalicIcon} <span class='ml-2'>Italic</span></button>
    </div>
`,
  }),
};
