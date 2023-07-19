import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui/toggle/helm';
import { BrnToggleDirective } from '@spartan-ng/ui/toggle/brain';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-large',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: `
    <button size="lg" brnToggle hlm>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  `,
})
export class ToggleLargePreviewComponent {}

export const largeCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@spartan-ng/ui/toggle/helm';
import { BrnToggleDirective } from '@spartan-ng/ui/toggle/brain';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-large',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: \`
    <button size="lg" brnToggle hlm>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  \`,
})
export class ToggleLargePreviewComponent {}
`;
