import { Component } from '@angular/core';

@Component({
  selector: 'hlm-breadcrumb',
  standalone: true,
  template: `
    <nav aria-label="breadcrumb">
      <ng-content />
    </nav>
  `,
})
export class HlmBreadcrumbComponent {}
