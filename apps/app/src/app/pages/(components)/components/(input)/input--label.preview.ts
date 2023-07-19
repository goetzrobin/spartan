import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';

@Component({
  selector: 'spartan-input-label',
  standalone: true,
  imports: [HlmInputDirective, HlmLabelDirective],
  template: ` <label hlmLabel
    >Email
    <input class="w-80" hlmInput type="email" placeholder="Email" />
  </label>`,
})
export class InputLabelPreviewComponent {}

export const labelCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';

@Component({
  selector: 'spartan-input-label',
  standalone: true,
  imports: [HlmInputDirective, HlmLabelDirective],
  template: \` <label hlmLabel
    >Email
    <input class="w-80" hlmInput type="email" placeholder="Email" />
  </label>\`,
})
export class InputLabelPreviewComponent {}
`;
