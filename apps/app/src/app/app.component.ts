import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'analog-trpc-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  host: {
    class: 'max-w-screen-lg mx-auto text-foreground block h-full'
  },
  template: `
    <analog-trpc-header />
    <router-outlet></router-outlet> `
})
export class AppComponent {
}
