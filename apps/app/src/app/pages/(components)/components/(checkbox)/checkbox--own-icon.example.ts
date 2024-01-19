import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixMoon } from '@ng-icons/radix-icons';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-own-icon',
	standalone: true,
	imports: [HlmLabelDirective, HlmCheckboxComponent],
	providers: [provideIcons({ radixMoon })],
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" checkIconName="radixMoon" />
			Accept terms and conditions
		</label>
	`,
})
export class CheckboxOwnIconComponent {}

export const checkboxOwnIconCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixMoon } from '@ng-icons/radix-icons';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-own-icon',
	standalone: true,
	imports: [HlmLabelDirective, HlmCheckboxComponent],
	providers: [provideIcons({ radixMoon })],
	template: \`
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" checkIconName="radixMoon" />
			Accept terms and conditions
		</label>
	\`,
})
export class CheckboxOwnIconComponent {}
`;
