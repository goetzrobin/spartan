import { Component } from '@angular/core';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';

@Component({
  selector: 'spartan-page-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent],
  host: {
    class: 'hidden w-[300px] xl:block text-sm',
  },
  template: `<hlm-scroll-area class="h-[calc(100vh-3.5rem)]">
    <div class="space-y-2">
      <h3 class="font-medium">On this page</h3>
      <ul class="flex flex-col m-0 list-none">
        <ng-content />
      </ul>
    </div>
  </hlm-scroll-area>`,
})
export class SideNavComponent {}
