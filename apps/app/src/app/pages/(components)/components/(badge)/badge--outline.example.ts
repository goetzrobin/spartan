import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-outline',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: ` <div hlmBadge variant="outline">Outline</div> `,
})
export class BadgeOutlineExampleComponent {}

export const outlineCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-outline',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: \` <div hlmBadge variant="outline">Outline</div> \`,
})
export class BadgeOutlineExampleComponent {}
`;
