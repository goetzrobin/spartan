import { Component } from '@angular/core';

@Component({
  selector: 'spartan-logo',
  standalone: true,
  host: {
    class: 'flex items-center justify-center',
  },
  template: `
    <svg class="w-full" viewBox="0 0 2723 1114" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M212.5 175.5L0 555.5L212.5 950.5L548 765.5L854 1113.5L2722.5 555.5L854 0L548 355.5L212.5 175.5ZM887 133.5L2296.92 557.305L887 979.654V821.637L1202.48 736.439V376.715L887 291.517V133.5ZM1838.83 557.305L1396.95 433.513V681.097L1838.83 557.305Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class SpartanLogoComponent {}
