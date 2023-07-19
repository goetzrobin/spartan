import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';

@Component({
  selector: 'spartan-toggle-preview',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: `
    <button hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  `,
})
export class TogglePreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';

@Component({
  selector: 'spartan-toggle-preview',
  standalone: true,
  imports: [HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: \`
    <button hlmToggle>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  \`,
})
export class TogglePreviewComponent {}
`;

export const defaultImports = `
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
`;
export const defaultSkeleton = `
<button hlmToggle>
  <hlm-icon size="sm" name="radixFontItalic" />
</button>
`;
