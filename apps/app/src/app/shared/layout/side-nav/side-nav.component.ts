import { Component } from '@angular/core';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { SideNavContentComponent } from './side-nav-content.component';

@Component({
  selector: 'spartan-side-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent, SideNavContentComponent],
  host: {
    class: 'hidden sm:block',
  },
  template: `<hlm-scroll-area class="h-[calc(100vh-3.5rem)] text-sm py-6 pl-8 pr-6 lg:py-8">
    <spartan-side-nav-content />
  </hlm-scroll-area>`,
})
export class SideNavComponent {}
