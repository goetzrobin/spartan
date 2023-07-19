import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { BrnToggleDirective } from '@ng-spartan/ui/toggle/brain';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixUnderline } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-disabled',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixUnderline })],
  template: `
    <button disabled brnToggle hlm>
      <hlm-icon size="sm" name="radixUnderline" />
    </button>
  `,
})
export class ToggleDisabledPreviewComponent {}

export const disabledCode = `
import { Component } from '@angular/core';
import { HlmToggleDirective } from '@ng-spartan/ui/toggle/helm';
import { BrnToggleDirective } from '@ng-spartan/ui/toggle/brain';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixUnderline } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-toggle-disabled',
  standalone: true,
  imports: [BrnToggleDirective, HlmToggleDirective, HlmIconComponent],
  providers: [provideIcons({ radixUnderline })],
  template: \`
    <button disabled brnToggle hlm>
      <hlm-icon size="sm" name="radixUnderline" />
    </button>
  \`,
})
export class ToggleDisabledPreviewComponent {}
`;
