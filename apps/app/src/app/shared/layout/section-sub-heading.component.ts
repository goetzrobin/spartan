import { Component } from '@angular/core';

@Component({
  selector: 'spartan-section-sub-heading',
  standalone: true,
  host: {
    class: 'block mt-12 pb-2 first:mt-0',
  },
  template: `
    <h2 class="font-heading scroll-m-20 border-border border-b text-2xl font-semibold tracking-tight">
      <ng-content />
    </h2>
  `,
})
export class SectionSubHeadingComponent {}
