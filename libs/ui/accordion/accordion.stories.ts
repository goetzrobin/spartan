import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from './brain/src';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from './helm/src';

const meta: Meta<BrnAccordionComponent> = {
  title: 'Accordion',
  component: BrnAccordionComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrnAccordionComponent,
        BrnAccordionContentComponent,
        BrnAccordionItemComponent,
        BrnAccordionTriggerComponent,
        HlmAccordionContentDirective,
        HlmAccordionDirective,
        HlmAccordionIconComponent,
        HlmAccordionItemDirective,
        HlmAccordionTriggerDirective,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrnAccordionComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <brn-accordion hlm>

      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>What is SPARTAN</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          It is a collection of full-stack technologies that provide end-to-end type-safety.
        </brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>What is SPARTAN Brain</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          A collection of unstyled UI primitives that provide accessibility out of the box.
        </brn-accordion-content>
      </brn-accordion-item>

            <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>What is SPARTAN Helm</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          Directives, sometimes additional components, that provide shadcn like styles for the Angular ecosystem.
        </brn-accordion-content>
      </brn-accordion-item>
      </brn-accordion>
    `,
  }),
};
