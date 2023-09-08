import { Component, Input } from '@angular/core';
import { SpartanLogoComponent } from '~/app/shared/spartan-logo.component';

@Component({
  selector: 'spartan-th-item',
  standalone: true,
  imports: [SpartanLogoComponent],
  host: {
    class: 'inline-flex flex-col justify-center items-center',
  },
  template: `<spartan-logo class="-rotate-90 h-8 w-8 rounded-full bg-primary [&>svg]:text-primary-foreground p-1" /><a
      class="hover:underline inline-block text-sm mt-1 font-medium"
      [href]="href"
      target="_blank"
      ><ng-content
    /></a> `,
})
export class ThreeHundredItemComponent {
  @Input()
  href = '';
}
