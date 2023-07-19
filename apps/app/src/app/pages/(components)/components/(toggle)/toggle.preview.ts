import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { BrnToggleDirective } from '@ng-spartan/ui/toggle/brain';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';

@Component({
  selector: 'spartan-toggle-preview',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: `
    <button brnToggle hlm>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  `,
})
export class TogglePreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { BrnToggleDirective } from '@ng-spartan/ui/toggle/brain';
import { provideIcons } from '@ng-icons/core';
import { radixFontItalic } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';

@Component({
  selector: 'spartan-toggle-preview',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixFontItalic })],
  template: \`
    <button brnToggle hlm>
      <hlm-icon size="sm" name="radixFontItalic" />
    </button>
  \`,
})
export class TogglePreviewComponent {}
`;

export const defaultImports = `
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { BrnToggleDirective } from '@ng-spartan/ui/toggle/brain';
`;
export const defaultSkeleton = `
<button brnToggle hlm>
  <hlm-icon size="sm" name="radixFontItalic" />
</button>
`;
