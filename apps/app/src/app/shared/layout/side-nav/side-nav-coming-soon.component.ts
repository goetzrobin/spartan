import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'spartan-side-nav-cs',
  standalone: true,
  imports: [HlmBadgeDirective],
  host: {
    class: 'inline-block',
  },
  template: `<span class="font-medium text-primary-foreground rounded-lg bg-primary text-[0.5rem] py-0.5 px-1"
    >soon</span
  >`,
})
export class SideNavComponent {}
