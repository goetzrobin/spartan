import { Component } from '@angular/core';
import {
	BrnAccordionContentComponent,
	BrnAccordionDirective,
	BrnAccordionItemDirective,
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
		BrnAccordionItemDirective,
		BrnAccordionTriggerDirective,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentDirective,
		HlmAccordionIconComponent,
	],
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
})
export class AccordionPreviewComponent {}

export const codeImports = `
import {
  BrnAccordionDirective,
  BrnAccordionContentComponent,
  BrnAccordionItemDirective,
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

export const codeString =
	"import { Component } from '@angular/core';" +
	codeImports +
	`
@Component({
  selector: 'spartan-accordion-preview',
  standalone: true,
  imports: [
    BrnAccordionDirective,
    BrnAccordionContentComponent,
    BrnAccordionItemDirective,
    BrnAccordionTriggerDirective,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentDirective,
    HlmAccordionIconComponent,
  ],
  template: \`
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
  \`,
})
export class AccordionPreviewComponent {}
`;

export const codeSkeleton = `
<div BrnAccordion HlmAccrodionhlm>
  <div hlmAccordionItem>
    <button hlmAccordionTrigger>
      <span>Is it accessible?</span>
      <hlm-accordion-icon />
    </button>
    <brn-accordion-content hlm>
      Yes. It adheres to the WAI-ARIA design pattern.
    </brn-accordion-content>
  </div>
</div>
`;
