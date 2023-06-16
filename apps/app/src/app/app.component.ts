import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmAspectRatioDirective } from '@ng-spartan/ui/aspect-ratio/helm';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'analog-trpc-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HlmAspectRatioDirective],
  host: {
    class: 'max-w-screen-lg mx-auto text-foreground block h-full',
  },
  template: `
    <analog-trpc-header />
    <router-outlet></router-outlet>
    <div hlmAspectRatio="16/10">
      <div style="background: url('https://picsum.photos/seed/picsum/800/600'); background-size: cover"></div>
    </div>
  `,
})
export class AppComponent {}
