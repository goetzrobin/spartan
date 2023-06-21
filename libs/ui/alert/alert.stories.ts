import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from './helm/src';

const meta: Meta<HlmAlertDirective> = {
  title: 'Alert',
  decorators: [
    moduleMetadata({
      imports: [HlmAlertDirective, HlmAlertDescriptionDirective, HlmAlertIconDirective, HlmAlertTitleDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<HlmAlertDirective>;

export const Default: Story = {
  render: () => ({
    template: `
      <div class='max-w-xl' hlmAlert>
       <svg
      hlmAlertIcon
      class='h-4 w-4'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke-width='1.5'
      stroke='currentColor'
    >
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z'
      />
    </svg>

    <h4 hlmAlertTitle>Introducing SPARTAN helm & brain</h4>
    <p hlmAlertDesc>
      The components used on this page are also the intiial building blocks of a new UI library. It is made up of
      headless UI providers, the brain components/directives, which add ARIA compliant markup and interactions. On top
      of the brain we add helm(et) directives, which add shadcn-like styles to
      our application.
    </p>
      </div>
    `,
  }),
};

export const Destructive: Story = {
  render: () => ({
    template: `
      <div hlmAlert class='max-w-xl' variant='destructive'>
      <svg hlmAlertIcon xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-5 h-5'>
        <path stroke-linecap='round' stroke-linejoin='round' d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' />
      </svg>

    <h4 hlmAlertTitle>Something went wrong...</h4>
    <p hlmAlertDesc>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aperiam at autem culpa debitis eius eveniet exercitationem, facilis illo magni mollitia, necessitatibus nesciunt quam quos recusandae tempore ullam velit veniam!
    </p>
      </div>
    `,
  }),
};
