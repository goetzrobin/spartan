import { Component } from '@angular/core';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from '@ng-spartan/ui/accordion/brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@ng-spartan/ui/accordion/helm';

@Component({
  selector: 'analog-trpc-faq',
  standalone: true,
  host: {
    class: 'block',
  },
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
          <span>What technologies are used</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm> Supabase, Drizzle, Angular, tRPC, Tailwind, Analog, and Nx.</brn-accordion-content>
      </brn-accordion-item>
    </brn-accordion>
  `,
})
export class FaqComponent {}
