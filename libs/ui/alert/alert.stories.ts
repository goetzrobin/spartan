import { lucideAlertCircle, lucideInfo } from '@ng-icons/lucide';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmAlertDirective, HlmAlertImports } from './helm/src';

const meta: Meta<HlmAlertDirective> = {
	title: 'Alert',
	component: HlmAlertDirective,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			options: ['default', 'destructive'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmAlertImports, HlmIconComponent],
			providers: [provideIcons({ lucideInfo, lucideAlertCircle })],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
     <div class='max-w-xl' hlmAlert ${argsToTemplate(args)}>
      <hlm-icon name='lucideInfo' hlmAlertIcon />
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

export default meta;
type Story = StoryObj<HlmAlertDirective>;

export const Default: Story = {
	args: {
		variant: 'default',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
     <div hlmAlert class='max-w-xl' ${argsToTemplate(args)}>
      <hlm-icon name='lucideAlertCircle' hlmAlertIcon />
      <h4 hlmAlertTitle>Something went wrong...</h4>
      <p hlmAlertDesc>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aperiam at autem culpa debitis eius eveniet exercitationem, facilis illo magni mollitia, necessitatibus nesciunt quam quos recusandae tempore ullam velit veniam!
      </p>
     </div>
    `,
	}),
};
