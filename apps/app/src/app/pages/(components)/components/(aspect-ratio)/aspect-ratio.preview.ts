import { Component } from '@angular/core';
import { HlmAspectRatioDirective } from '@ng-spartan/ui/aspect-ratio/helm';

@Component({
  selector: 'spartan-aspect-ratio-preview',
  standalone: true,
  imports: [HlmAspectRatioDirective],
  template: `
    <div class="overflow-hidden rounded-xl drop-shadow max-w-xl">
      <div [hlmAspectRatio]="16 / 9">
        <img alt="Mountain views" src="/assets/mountains.jpg" />
      </div>
    </div>
  `,
})
export class AspectRatioPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmAspectRatioDirective } from '@ng-spartan/ui/aspect-ratio/helm';

@Component({
  selector: 'spartan-aspect-ratio-preview',
  standalone: true,
  imports: [HlmAspectRatioDirective],
  template: \`
    <div class="overflow-hidden rounded-xl drop-shadow max-w-xl">
      <div [hlmAspectRatio]="16 / 9">
        <img alt="Mountain views" src="/mountains.jpg" />
      </div>
    </div>
  \`,
})
export class AspectRatioPreviewComponent {}
`;

export const defaultImports = `
import { HlmAspectRatioDirective } from '@ng-spartan/ui/aspect-ratio/helm';
`;

export const defaultSkeleton = `
<div class="overflow-hidden rounded-xl drop-shadow max-w-xl">
  <div [hlmAspectRatio]="ratio">
    <img alt="Mountain views" src="/mountains.jpg" />
  </div>
</div>
`;
