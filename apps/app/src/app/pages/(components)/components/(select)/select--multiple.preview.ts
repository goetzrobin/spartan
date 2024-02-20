import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixChevronDown, radixChevronUp } from '@ng-icons/radix-icons';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
	selector: 'spartan-select-multiple-preview',
	standalone: true,
	imports: [BrnSelectImports, HlmSelectImports],
	providers: [provideIcons({ radixChevronUp, radixChevronDown })],
	template: `
		<brn-select class="inline-block" placeholder="Select some fruit" [multiple]="true">
			<hlm-select-trigger class="w-56">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content class="w-56">
				<hlm-option value="Apples">Apples</hlm-option>
				<hlm-option value="Bananas">Bananas</hlm-option>
				<hlm-option value="Pears">Pears</hlm-option>
				<hlm-option value="Strawberries">Strawberries</hlm-option>
			</hlm-select-content>
		</brn-select>
	`,
})
export class SelectMultiplePreviewComponent {}

export const multipleCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixChevronDown, radixChevronUp } from '@ng-icons/radix-icons';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';

@Component({
  selector: 'spartan-select-multiple-preview',
  standalone: true,
  imports: [BrnSelectImports, HlmSelectImports],
  providers: [provideIcons({ radixChevronUp, radixChevronDown })],
  template: \`
    <brn-select class="inline-block" placeholder="Select some fruit" [multiple]="true">
      <hlm-select-trigger class="w-56">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content class="w-56">
        <hlm-option value="Apples">Apples</hlm-option>
        <hlm-option value="Bananas">Bananas</hlm-option>
        <hlm-option value="Pears">Pears</hlm-option>
        <hlm-option value="Strawberries">Strawberries</hlm-option>
      </hlm-select-content>
    </brn-select>
  \`,
})
export class SelectMultiplePreviewComponent {}
`;
