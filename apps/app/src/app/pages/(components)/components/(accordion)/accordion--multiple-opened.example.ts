import { Component, signal } from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
	HlmAccordionContentDirective,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-accordion-multiple-opened',
	standalone: true,
	imports: [
		HlmButtonDirective,
		BrnAccordionContentComponent,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentDirective,
		HlmAccordionIconDirective,
		HlmIconComponent,
	],
	template: `
		<div hlmAccordion type="multiple" class="pb-4">
			<div hlmAccordionItem isOpened>
				<button hlmAccordionTrigger>
					Is it accessible?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</div>
		</div>
		<button hlmBtn (click)="toggleThird()">Toggle Third Item</button>
	`,
})
export class AccordionMultipleOpenedComponent {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}

export const multipleOpenedCodeString = `import { Component, signal } from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import {
	HlmAccordionContentDirective,
	HlmAccordionDirective,
	HlmAccordionIconDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-accordion-multiple-opened',
	standalone: true,
	imports: [
		HlmButtonDirective,
		BrnAccordionContentComponent,
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentDirective,
		HlmAccordionIconDirective,
		HlmIconComponent,
	],
	template: \`
		<div hlmAccordion type="multiple" class="pb-4">
			<div hlmAccordionItem isOpened>
				<button hlmAccordionTrigger>
					Is it accessible?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>Yes. It adheres to the WAI-ARIA design pattern.</brn-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>
					Yes. It comes with default styles that match the other components' aesthetics.
				</brn-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</button>
				<brn-accordion-content hlm>
					Yes. It's animated by default, but you can disable it if you prefer.
				</brn-accordion-content>
			</div>
		</div>
		<button hlmBtn (click)="toggleThird()">Toggle Third Item</button>
	\`,
})
export class AccordionMultipleOpenedComponent {
	protected readonly _thirdOpened = signal(false);
	toggleThird() {
		this._thirdOpened.set(!this._thirdOpened());
	}
}`;
