import { Component } from '@angular/core';
import {
	BrnAccordionContentComponent,
	BrnAccordionDirective,
	BrnAccordionItemComponent,
	BrnAccordionTriggerDirective,
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
		BrnAccordionDirective,
		BrnAccordionContentComponent,
		BrnAccordionItemComponent,
		BrnAccordionTriggerDirective,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentDirective,
		HlmAccordionIconComponent,
	],
	template: `
		<div hlmAccordion>
			<brn-accordion-item hlm>
				<button hlmAccordionTrigger>
					<span>Is it accessible?</span>
					<hlm-accordion-icon />
				</button>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</brn-accordion-item>

			<brn-accordion-item hlm>
				<button hlmAccordionTrigger>
					<span>Is it styled</span>
					<hlm-accordion-icon />
				</button>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</brn-accordion-item>

			<brn-accordion-item hlm>
				<button hlmAccordionTrigger>
					<span>Is it animated?</span>
					<hlm-accordion-icon />
				</button>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</brn-accordion-item>
		</div>
	`,
})
export class AccordionPreviewComponent {}

export const codeString = `
import { Component } from '@angular/core';
import {
  BrnAccordionDirective,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerDirective,
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
    BrnAccordionDirective,
    BrnAccordionContentComponent,
    BrnAccordionItemComponent,
    BrnAccordionTriggerDirective,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentDirective,
    HlmAccordionIconComponent,
  ],
  template: \`
    <div hlmAccordion>
      <brn-accordion-item hlm>
        <button hlmAccordionTrigger>
          <span>Is it accessible?</span>
          <hlm-accordion-icon />
        </button>
        <brn-accordion-content hlm> Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <button hlmAccordionTrigger>
          <span>Is it styled</span>
          <hlm-accordion-icon />
        </button>
        <brn-accordion-content hlm>
          Yes. It comes with default styles that match the other components' aesthetics.
        </brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <button hlmAccordionTrigger>
          <span>Is it animated?</span>
          <hlm-accordion-icon />
        </button>
        <brn-accordion-content hlm>
          Yes. It's animated by default, but you can disable it if you prefer.
        </brn-accordion-content>
      </brn-accordion-item>
    </div>
  \`,
})
export class AccordionPreviewComponent {}
`;

export const codeImports = `
import {
  BrnAccordionDirective,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerDirective,
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
<div BrnAccordion HlmAccrodionhlm>
  <brn-accordion-item hlm>
    <brn-accordion-trigger hlm>
      <span>Is it accessible?</span>
      <hlm-accordion-icon />
    </brn-accordion-trigger>
    <brn-accordion-content hlm>
      Yes. It adheres to the WAI-ARIA design pattern.
    </brn-accordion-content>
  </brn-accordion-item>
</div>
`;
