import { Component } from '@angular/core';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@ng-spartan/ui/switch/brain';
import { HlmSwitchDirective, HlmSwitchThumbDirective } from '@ng-spartan/ui/switch/helm';

@Component({
  selector: 'spartan-switch-preview',
  standalone: true,
  imports: [
    HlmLabelDirective,
    BrnSwitchComponent,
    BrnSwitchThumbComponent,
    HlmSwitchDirective,
    HlmSwitchThumbDirective,
  ],
  template: `
    <label class="flex items-center" hlmLabel>
      <brn-switch class="mr-2" hlm>
        <brn-switch-thumb hlm />
      </brn-switch>
      Airplane mode
    </label>
  `,
})
export class SwitchPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@ng-spartan/ui/switch/brain';
import { HlmSwitchDirective, HlmSwitchThumbDirective } from '@ng-spartan/ui/switch/helm';

@Component({
  selector: 'spartan-switch-preview',
  standalone: true,
  imports: [
    HlmLabelDirective,
    BrnSwitchComponent,
    BrnSwitchThumbComponent,
    HlmSwitchDirective,
    HlmSwitchThumbDirective,
  ],
  template: \`
    <label class="flex items-center" hlmLabel>
      <brn-switch class="mr-2" hlm>
        <brn-switch-thumb hlm />
      </brn-switch>
      Airplane mode
    </label>
  \`,
})
export class SwitchPreviewComponent {}
`;

export const defaultImports = `
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@ng-spartan/ui/switch/brain';
import { HlmSwitchDirective, HlmSwitchThumbDirective } from '@ng-spartan/ui/switch/helm';
`;
export const defaultSkeleton = `
<brn-switch hlm>
  <brn-switch-thumb hlm />
</brn-switch>
`;
