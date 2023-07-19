import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';

@Component({
  selector: 'spartan-label-preview',
  standalone: true,
  imports: [HlmLabelDirective, HlmInputDirective],
  template: `
    <label hlmLabel
      >E-Mail
      <input class="w-80" hlmInput type="email" placeholder="Email" />
    </label>
  `,
})
export class LabelPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';

@Component({
  selector: 'spartan-label-preview',
  standalone: true,
  imports: [HlmLabelDirective, HlmInputDirective],
  template: \`
    <label hlmLabel>E-Mail
      <input class='w-80' hlmInput type='email' placeholder='Email'/>
    </label>
  \`,
})
export class LabelPreviewComponent {}

`;

export const defaultImports = `
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
`;
export const defaultSkeleton = `<label hlmLabel>Label<input/></label>`;
