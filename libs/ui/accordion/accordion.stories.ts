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
      <div hlmAccordion>
        <div hlmAccordionItem>
          <button hlmAccordionTrigger>
            <span>Is it accessible?</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <button hlmAccordionTrigger>
            <span>Is it styled</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>
            Yes. It comes with default styles that match the other components' aesthetics.
          </brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <button hlmAccordionTrigger>
            <span>Is it animated?</span>
            <hlm-accordion-icon />
          </button>
          <brn-accordion-content hlm>
            Yes. It's animated by default, but you can disable it if you prefer.
          </brn-accordion-content>
        </div>
      </div>
    `,
	}),
};
