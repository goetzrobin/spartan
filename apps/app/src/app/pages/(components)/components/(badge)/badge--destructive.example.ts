import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-destructive',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: ` <div hlmBadge variant="destructive">Destructive</div> `,
})
export class BadgeDestructiveComponent {}

export const destructiveCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-destructive',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: \` <div hlmBadge variant='destructive'>Destructive</div> \`,
})
export class BadgeDestructiveComponent {}
`;
