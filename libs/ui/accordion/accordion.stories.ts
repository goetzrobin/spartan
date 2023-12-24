import { radixChevronDown } from '@ng-icons/radix-icons';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { BrnAccordionDirective, BrnAccordionImports } from './brain/src';
import { HlmAccordionImports } from './helm/src';

const meta: Meta<BrnAccordionDirective> = {
	title: 'Accordion',
	component: BrnAccordionDirective,
	decorators: [
		moduleMetadata({
			imports: [BrnAccordionImports, HlmAccordionImports, HlmIconComponent],
			providers: [provideIcons({ radixChevronDown })],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnAccordionDirective>;

export const Default: Story = {
	render: () => ({
		template: `
      <hlm-accordion>
        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Is it accessible?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. It adheres to the WAI-ARIA design pattern.
          </hlm-accordion-content>
        </hlm-accordion-item>
        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Is it styled?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. It comes with default styles that match the other components' aesthetics.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Is it animated?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. It's animated by default, but you can disable it if you prefer.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
	}),
};
export const TwoAccordions: Story = {
	render: () => ({
		template: `
      <div hlmAccordion>
        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it accessible?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it styled?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>
            Yes. It comes with default styles that match the other components' aesthetics.
          </brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it animated?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>
            Yes. It's animated by default, but you can disable it if you prefer.
          </brn-accordion-content>
        </div>
      </div>
      <div hlmAccordion>
        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it accessible?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it styled?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>
            Yes. It comes with default styles that match the other components' aesthetics.
          </brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <hlm-accordion-trigger>
            Is it styled?
            <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>
            Yes. It comes with default styles that match the other components' aesthetics.
          </brn-accordion-content>
        </div>

        <div hlmAccordionItem>
          <hlm-accordion-trigger>
              Is it styled?
              <hlm-icon hlmAccIcon />
          </hlm-accordion-trigger>
          <brn-accordion-content hlm>
            Yes. It comes with default styles that match the other components' aesthetics.
          </brn-accordion-content>
        </div>

      </div>
    `,
	}),
};
