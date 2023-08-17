import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'spartan-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    class: 'text-foreground block antialiased',
  },
  template: `
    <spartan-header />
    <div class="max-w-screen-xl mx-auto">
      <router-outlet />
    </div>
    <spartan-footer />
  `,
})
export class AppComponent {}
