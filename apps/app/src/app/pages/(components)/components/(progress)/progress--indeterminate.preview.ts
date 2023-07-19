import { Component } from '@angular/core';
import { BrnProgressComponent, BrnProgressIndicatorComponent } from '@ng-spartan/ui/progress/brain';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@ng-spartan/ui/progress/helm';

@Component({
  selector: 'spartan-progress-indeterminate',
  standalone: true,
  imports: [BrnProgressComponent, BrnProgressIndicatorComponent, HlmProgressIndicatorDirective, HlmProgressDirective],
  template: `
    <brn-progress class="w-80" hlm aria-labelledby="loading">
      <brn-progress-indicator hlm />
    </brn-progress>
  `,
})
export class ProgressIndeterminatePreviewComponent {}

export const indeterminateCode = `
import { Component } from '@angular/core';
import { BrnProgressComponent, BrnProgressIndicatorComponent } from '@ng-spartan/ui/progress/brain';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@ng-spartan/ui/progress/helm';

@Component({
  selector: 'spartan-progress-indeterminate',
  standalone: true,
  imports: [BrnProgressComponent, BrnProgressIndicatorComponent, HlmProgressIndicatorDirective, HlmProgressDirective],
  template: \`
    <brn-progress hlm aria-labelledby='loading'>
      <brn-progress-indicator hlm />
    </brn-progress>
  \`,
})
export class ProgressIndeterminatePreviewComponent {}
`;
