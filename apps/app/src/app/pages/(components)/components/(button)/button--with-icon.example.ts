import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	selector: 'spartan-button-with-icon',
	standalone: true,
	imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
	providers: [provideIcons({ lucideMail })],
	template: `
		<button hlmBtn>
			<hlm-icon size="sm" class="mr-2" name="lucideMail" />
			Login with Email
		</button>
	`,
})
export class ButtonWithIconComponent {}

export const withIconCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-button-with-icon',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
  providers: [provideIcons({ lucideMail })],
  template: \`
    <button hlmBtn>
      <hlm-icon size="sm" class="mr-2" name="lucideMail" />
      Login with Email
    </button>
  \`,
})
export class ButtonWithIconComponent {}
`;
