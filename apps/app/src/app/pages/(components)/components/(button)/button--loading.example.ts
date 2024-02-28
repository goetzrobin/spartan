import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader2 } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	selector: 'spartan-button-loading',
	standalone: true,
	imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
	providers: [provideIcons({ lucideLoader2 })],
	template: `
		<button disabled hlmBtn>
			<hlm-icon name="lucideLoader2" size="sm" class="mr-2 animate-spin" />
			Please wait
		</button>
	`,
})
export class ButtonLoadingComponent {}

export const loadingCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader2 } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-button-loading',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
  providers: [provideIcons({ lucideLoader2 })],
  template: \`
    <button disabled hlmBtn><hlm-icon name="lucideLoader2" size="sm" class="mr-2 animate-spin" /> Please wait</button>
  \`,
})
export class ButtonLoadingComponent {}
`;
