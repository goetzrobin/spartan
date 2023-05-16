import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'analog-trpc-root',
  standalone: true,
  imports: [RouterOutlet],
  host: {
    class: 'max-w-screen-md mx-auto text-foreground block h-full'
  },
  template: `
    <router-outlet></router-outlet> `
})
export class AppComponent {
}
