import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnAccordionDirective, BrnAccordionImports } from './brain/src';
import { HlmAccordionImports } from './helm/src';

const meta: Meta<BrnAccordionDirective> = {
	title: 'Accordion',
	component: BrnAccordionDirective,
	decorators: [
		moduleMetadata({
			imports: [BrnAccordionImports, HlmAccordionImports],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnAccordionDirective>;

export const Default: Story = {
	render: () => ({
		template: `
      <div brnAccordion hlmAccordion>
        <brn-accordion-item hlm>
          <button hlmAccordionTrigger>
            <span>What is SPARTAN</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>
            It is a collection of full-stack technologies that provide end-to-end type-safety.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <button hlmAccordionTrigger>
            <span>What is SPARTAN Brain</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>
            A collection of unstyled UI primitives that provide accessibility out of the box.
          </brn-accordion-content>
        </brn-accordion-item>

        <brn-accordion-item hlm>
          <button hlmAccordionTrigger>
            <span>What is SPARTAN Helm</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>
            Directives, sometimes additional components, that provide shadcn like styles for the Angular ecosystem.
          </brn-accordion-content>
        </brn-accordion-item>
      </div>
    `,
	}),
};
