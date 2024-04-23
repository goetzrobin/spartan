import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-disabled',
	standalone: true,
	imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
	providers: [provideIcons({ lucideUnderline })],
	template: `
		<button disabled brnToggle hlm>
			<hlm-icon size="sm" name="lucideUnderline" />
		</button>
	`,
})
export class ToggleDisabledPreviewComponent {}

export const disabledCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideUnderline } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-disabled',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ lucideUnderline })],
  template: \`
    <button disabled brnToggle hlm>
      <hlm-icon size="sm" name="lucideUnderline" />
    </button>
  \`,
})
export class ToggleDisabledPreviewComponent {}
`;
