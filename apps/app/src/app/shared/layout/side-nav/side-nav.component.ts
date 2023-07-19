import { Component } from '@angular/core';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scroll-area-helm';
import { SideNavContentComponent } from './side-nav-content.component';

@Component({
  selector: 'spartan-side-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent, SideNavContentComponent],
  host: {
    class: 'fixed text-sm top-12 pr-2 pt-6 pb-12 flex z-30 -ml-2 hidden w-full shrink-0 md:sticky md:block',
  },
  template: `<hlm-scroll-area visibility="hover" class="h-[calc(100vh-3.5rem)]">
    <spartan-side-nav-content />
  </hlm-scroll-area>`,
})
export class SideNavComponent {}
