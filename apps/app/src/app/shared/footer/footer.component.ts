import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { hlmMuted } from '@ng-spartan/ui/typography/helm';

@Component({
  selector: 'spartan-footer',
  standalone: true,
  imports: [HlmButtonDirective],
  host: {
    class: 'block border-t border-border px-4 py-8',
  },
  template: `<footer class="text-sm max-w-screen-xl mx-auto ${hlmMuted}">
    Created by
    <a class="h-6 text-sm px-0.5" hlmBtn href="https://twitter.com/shadcn" target="_blank" variant="link">shadcn.</a>
    Built by
    <a class="h-6 text-sm px-0.5" hlmBtn href="https://twitter.com/goetzrobin" target="_blank" variant="link"
      >goetzrobin</a
    >
    &
    <a class="h-6 text-sm px-0.5" hlmBtn href="https://github.com/mihajm" target="_blank" variant="link">mihajm.</a>
    Open source and available on
    <a class="h-6 text-sm px-0.5" hlmBtn href="https://github.com/goetzrobin/spartan" target="_blank" variant="link"
      >GitHub.</a
    >
  </footer>`,
})
export class FooterComponent {}
