import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { HlmSeparatorDirective } from '@ng-spartan/ui/separator/helm';

@Component({
  selector: 'spartan-scroll-area-preview',
  standalone: true,
  imports: [NgFor, HlmSeparatorDirective, HlmScrollAreaComponent],
  template: ` <hlm-scroll-area class="h-72 w-48 rounded-md border border-border">
    <div class="p-4">
      <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
      <div class="text-sm" *ngFor="let tag of tags">
        {{ tag }}
        <div hlmSeparator class="my-2"></div>
      </div>
    </div>
  </hlm-scroll-area>`,
})
export class ScrollAreaPreviewComponent {
  tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
}

export const defaultCode = `
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { HlmSeparatorDirective } from '@ng-spartan/ui/separator/helm';

@Component({
  selector: 'spartan-scroll-area-preview',
  standalone: true,
  imports: [NgFor, HlmSeparatorDirective, HlmScrollAreaComponent],
  template: \` <hlm-scroll-area class="h-72 w-48 rounded-md border border-border">
    <div class="p-4">
      <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
      <div class="text-sm" *ngFor="let tag of tags">
        {{ tag }}
        <div hlmSeparator class="my-2"></div>
      </div>
    </div>
  </hlm-scroll-area>\`,
})
export class ScrollAreaPreviewComponent {
  tags = Array.from({ length: 50 }).map((_, i, a) => \`v1.2.0-beta.\$\{a.length - i\}\`);
}
`;

export const defaultImports = `
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
`;
export const defaultSkeleton = `
<hlm-scroll-area class="w-72 rounded-md border border-border">
  <div class='p-6 whitespace-nowrap'>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto,<br>
    asperiores beatae consequuntur dolor ducimus et exercitationem facilis fugiat magni<br>
    nisi officiis quibusdam rem repellat reprehenderit totam veritatis voluptatibus! Nobis.
  </div>
</hlm-scroll-area>
`;
