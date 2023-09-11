import { Component, Input } from '@angular/core';
import { SpartanLogoComponent } from '~/app/shared/spartan-logo.component';

@Component({
  selector: 'spartan-th-item',
  standalone: true,
  imports: [SpartanLogoComponent],
  host: {
    class: 'inline-flex flex-col justify-center items-center',
  },
  template: `<spartan-logo class="-rotate-90 h-9 w-9 rounded-full bg-primary p-1" /><a
      class="hover:underline whitespace-nowrap inline-block text-[.55rem] mt-1 font-medium"
      [href]="href"
      target="_blank"
      ><ng-content
    /></a> `,
})
export class ThreeHundredItemComponent {
  @Input()
  href = '';
}
