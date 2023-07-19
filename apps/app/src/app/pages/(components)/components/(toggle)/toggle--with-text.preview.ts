import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-with-text',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: `
    <button hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
      <span class="ml-2">Italic</span>
    </button>
  `,
})
export class ToggleWithTextPreviewComponent {}

export const withTextCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-with-text',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: \`
    <button hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
      <span class="ml-2">Italic</span>
    </button>
  \`,
})
export class ToggleWithTextPreviewComponent {}
`;
