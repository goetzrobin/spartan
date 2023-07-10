import { Component, Input } from '@angular/core';
import { hlmMuted } from '@ng-spartan/ui/typography/helm';

@Component({
  selector: 'spartan-section-intro',
  standalone: true,
  host: {
    class: 'mb-8 block space-y-2',
  },
  template: `
    <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">{{ name }}</h1>
    <p class="${hlmMuted}">{{ lead }}</p>
  `,
})
export class SectionIntroComponent {
  @Input()
  name = '';
  @Input()
  lead = '';
}
