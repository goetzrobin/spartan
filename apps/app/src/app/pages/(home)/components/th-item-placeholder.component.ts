import { Component } from '@angular/core';
import { SpartanLogoComponent } from '~/app/shared/spartan-logo.component';

@Component({
  selector: 'spartan-th-item-placeholder',
  standalone: true,
  imports: [SpartanLogoComponent],
  host: {
    class: 'inline-flex flex-col justify-center items-center',
  },
  template: `<spartan-logo
      class="-rotate-90 h-9 w-9 rounded-full bg-muted/40 [&>svg]:grayscale [&>svg]:opacity-10 dark:[&>svg]:opacity-50 p-1"
    />
    <div class="h-6"></div> `,
})
export class ThreeHundredItemPlaceholderComponent {}
