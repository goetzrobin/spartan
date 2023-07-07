import { Component } from '@angular/core';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { SidePanelNavComponent } from './side-panel-nav.component';

@Component({
  selector: 'spartan-side-panel',
  standalone: true,
  imports: [HlmScrollAreaComponent, SidePanelNavComponent],
  host: {
    class: 'hidden sm:block',
  },
  template: `<hlm-scroll-area class="h-[calc(100vh-3.5rem)] text-sm py-6 pl-8 pr-6 lg:py-8">
    <spartan-side-panel-nav />
  </hlm-scroll-area>`,
})
export class SidePanelComponent {}
