import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { pageNavTmpl } from '~/app/shared/layout/page-nav/page-nav-outlet.component';

@Component({
  selector: 'spartan-page-nav',
  standalone: true,
  imports: [HlmScrollAreaComponent],
  host: {
    class: 'hidden xl:block text-sm',
  },
  template: `
    <ng-template #pageNav>
      <hlm-scroll-area class="h-[calc(100vh-3.5rem)]">
        <div class="px-1 space-y-2">
          <h3 class="font-medium">On this page</h3>
          <ul class="flex flex-col m-0 list-none">
            <ng-content />
          </ul>
        </div>
      </hlm-scroll-area>
    </ng-template>
  `,
})
export class PageNavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pageNav', { static: true })
  pageNavTpl?: TemplateRef<unknown>;

  ngAfterViewInit() {
    if (!this.pageNavTpl) return;
    pageNavTmpl.set(this.pageNavTpl);
  }
  ngOnDestroy() {
    pageNavTmpl.set(null);
  }
}
