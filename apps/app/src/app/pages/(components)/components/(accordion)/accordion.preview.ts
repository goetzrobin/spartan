import { Component } from '@angular/core';
import {
	BrnAccordionComponent,
	BrnAccordionContentComponent,
	BrnAccordionItemComponent,
	BrnAccordionTriggerComponent,
} from '@spartan-ng/ui-accordion-brain';
import {
	HlmAccordionContentDirective,
	HlmAccordionDirective,
	HlmAccordionIconComponent,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';

@Component({
	selector: 'spartan-accordion-preview',
	standalone: true,
	imports: [
		BrnAccordionComponent,
		BrnAccordionContentComponent,
		BrnAccordionItemComponent,
		BrnAccordionTriggerComponent,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentDirective,
		HlmAccordionIconComponent,
	],
	template: `
		<brn-accordion hlm>
			<brn-accordion-item hlm>
				<brn-accordion-trigger hlm>
					<span>Is it accessible?</span>
					<hlm-accordion-icon />
				</brn-accordion-trigger>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</brn-accordion-item>

			<brn-accordion-item hlm>
				<brn-accordion-trigger hlm>
					<span>Is it styled</span>
					<hlm-accordion-icon />
				</brn-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</brn-accordion-item>

			<brn-accordion-item hlm>
				<brn-accordion-trigger hlm>
					<span>Is it animated?</span>
					<hlm-accordion-icon />
				</brn-accordion-trigger>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</brn-accordion-item>
		</brn-accordion>
	`,
})
export class AccordionPreviewComponent {}

export const codeString = `
import { Component } from '@angular/core';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';

@Component({
  selector: 'spartan-accordion-preview',
  standalone: true,
  imports: [
    BrnAccordionComponent,
    BrnAccordionContentComponent,
    BrnAccordionItemComponent,
    BrnAccordionTriggerComponent,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentDirective,
    HlmAccordionIconComponent,
  ],
  template: \`
    <brn-accordion hlm>
      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>Is it accessible?</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm> Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>Is it styled</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          Yes. It comes with default styles that match the other components' aesthetics.
        </brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>Is it animated?</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          Yes. It's animated by default, but you can disable it if you prefer.
        </brn-accordion-content>
      </brn-accordion-item>
    </brn-accordion>
  \`,
})
export class AccordionPreviewComponent {}
`;

export const codeImports = `
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent,
} from '@spartan-ng/ui-accordion-brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
`;

export const codeSkeleton = `
<brn-accordion hlm>
  <brn-accordion-item hlm>
    <brn-accordion-trigger hlm>
      <span>Is it accessible?</span>
      <hlm-accordion-icon />
    </brn-accordion-trigger>
    <brn-accordion-content hlm>
      Yes. It adheres to the WAI-ARIA design pattern.
    </brn-accordion-content>
  </brn-accordion-item>
</brn-accordion>
`;
