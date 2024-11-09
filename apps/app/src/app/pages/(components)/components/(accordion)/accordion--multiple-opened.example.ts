import { Component, signal } from '@angular/core';
import {
	HlmAccordionContentComponent,
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
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentComponent,
		HlmAccordionIconDirective,
		HlmIconComponent,
	],
	template: `
		<div hlmAccordion type="multiple" class="pb-4">
			<div hlmAccordionItem [isOpened]="true">
				<button hlmAccordionTrigger>
					Is it accessible?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
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
import {
	HlmAccordionContentComponent,
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
		HlmAccordionDirective,
		HlmAccordionItemDirective,
		HlmAccordionTriggerDirective,
		HlmAccordionContentComponent,
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
				<hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
			</div>

			<div hlmAccordionItem>
				<button hlmAccordionTrigger>
					Is it styled?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It comes with default styles that match the other components' aesthetics.
				</hlm-accordion-content>
			</div>

			<div hlmAccordionItem [isOpened]="_thirdOpened()">
				<button hlmAccordionTrigger>
					Is it animated?
					<hlm-icon hlmAccIcon />
				</button>
				<hlm-accordion-content>
					Yes. It's animated by default, but you can disable it if you prefer.
				</hlm-accordion-content>
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
