import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'spartan-side-nav-cs',
  standalone: true,
  imports: [HlmBadgeDirective],
  host: {
    class: 'inline-block',
  },
  template: `<span class="font-medium text-white rounded-lg bg-destructive text-[0.5rem] py-0.5 px-1">soon</span>`,
})
export class SideNavComponent {}
