import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-preview',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: `
    <a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge>This is madness. This is spartan.</a>
  `,
})
export class BadgePreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-badge-preview',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: \`
    <a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge>This is madness. This is spartan.</a>
  \`,
})
export class BadgePreviewComponent {}
`;

export const defaultImports = `
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';
`;

export const defaultSkeleton = `
<a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge>This is madness. This is spartan.</a>
`;
