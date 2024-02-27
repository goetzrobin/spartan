import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';

@Component({
	selector: 'spartan-toggle-small',
	standalone: true,
	imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
	providers: [provideIcons({ lucideItalic })],
	template: `
		<button size="sm" brnToggle hlm>
			<hlm-icon size="sm" name="lucideItalic" />
		</button>
	`,
})
export class ToggleSmallPreviewComponent {}

export const smallCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui-toggle-helm';
import { BrnToggleDirective } from '@spartan-ng/ui-toggle-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-toggle-small',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ lucideItalic })],
  template: \`
    <button size="sm" brnToggle hlm>
      <hlm-icon size="sm" name="lucideItalic" />
    </button>
  \`,
})
export class ToggleSmallPreviewComponent {}

`;
