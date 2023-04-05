import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'analog-trpc-root',
  standalone: true,
  imports: [RouterOutlet],
  host: {
    class: 'block h-full'
  },
  changeDetection: ChangeDetectionStrategy.Default,
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}
