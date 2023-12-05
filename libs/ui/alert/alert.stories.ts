import { radixExclamationTriangle, radixInfoCircled } from '@ng-icons/radix-icons';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmAlertDirective, HlmAlertImports } from './helm/src';

const meta: Meta<HlmAlertDirective> = {
	title: 'Alert',
	decorators: [
		moduleMetadata({
			imports: [HlmAlertImports, HlmIconComponent],
			providers: [provideIcons({ radixInfoCircled, radixExclamationTriangle })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmAlertDirective>;

export const Default: Story = {
	render: () => ({
		template: `
     <div class='max-w-xl' hlmAlert>
      <hlm-icon name='radixInfoCircled' hlmAlertIcon />
      <h4 hlmAlertTitle>Introducing SPARTAN helm & brain</h4>
      <p hlmAlertDesc>
        The components used on this page are also the intial building blocks of a new UI library. It is made up of
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
      <hlm-icon name='radixExclamationTriangle' hlmAlertIcon />
      <h4 hlmAlertTitle>Something went wrong...</h4>
      <p hlmAlertDesc>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aperiam at autem culpa debitis eius eveniet exercitationem, facilis illo magni mollitia, necessitatibus nesciunt quam quos recusandae tempore ullam velit veniam!
      </p>
     </div>
    `,
	}),
};
