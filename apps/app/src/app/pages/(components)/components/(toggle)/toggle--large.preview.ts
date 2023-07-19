import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-large',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: `
    <button size="lg" hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  `,
})
export class ToggleLargePreviewComponent {}

export const largeCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-large',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: \`
    <button size="lg" hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  \`,
})
export class ToggleLargePreviewComponent {}
`;
