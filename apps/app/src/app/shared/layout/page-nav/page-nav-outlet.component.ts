import { Component, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export const pageNavTmpl = signal<TemplateRef<unknown> | null>(null);

@Component({
  selector: 'spartan-page-nav-outlet',
  standalone: true,
  host: {
    class: 'hidden xl:block text-sm sticky top-14 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6',
  },
  template: ` <ng-container [ngTemplateOutlet]="pageNavTmpl()"></ng-container> `,
  imports: [NgTemplateOutlet],
})
export class PageNavOutletComponent {
  public pageNavTmpl = pageNavTmpl.asReadonly();
}
