import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixChevronRight } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	selector: 'spartan-button-icon',
	standalone: true,
	imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
	providers: [provideIcons({ radixChevronRight })],
	template: `
		<button hlmBtn size="icon" variant="outline"><hlm-icon size="sm" name="radixChevronRight" /></button>
	`,
})
export class ButtonIconComponent {}

export const iconCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixChevronRight } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-button-icon',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
  providers: [provideIcons({ radixChevronRight })],
  template: \` <button hlmBtn size="icon" variant="outline"><hlm-icon size='sm' name="radixChevronRight" /></button> \`,
})
export class ButtonIconComponent {}
`;
