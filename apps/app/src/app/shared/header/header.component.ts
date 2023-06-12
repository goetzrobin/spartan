import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@ng-spartan/ui/switch/brain';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { HlmSwitchThumbDirective, UiSwitchHelmDirective } from '@ng-spartan/ui/switch/helm';
import { ThemeService } from '~/app/shared/theme.service';
import { HeaderLinkDirective } from '~/app/shared/header/header-link.directive';

@Component({
  selector: 'analog-trpc-header',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, BrnSwitchComponent, BrnSwitchThumbComponent, HlmLabelDirective, HlmSwitchThumbDirective, UiSwitchHelmDirective, HeaderLinkDirective],
  host: {
    class: 'flex justify-between pt-4 px-4 pb-6'
  },
  template: `
    <div class='flex items-center'>
      <span class='font-semibold italic text-xl'>SPARTAN</span>
      <img alt='Spartan Logo. A red arrowhead with the Angular A inside of it' class='ml-2 w-14'
           height='28' width='56'
           src='/assets/spartan.svg' />
    </div>

    <div class='flex space-x-2'>
      <a routerLink='/' appHeaderLink>
        Home
      </a>
      <a routerLink='/typography' appHeaderLink>
        Typography
      </a>
    </div>

    <label hlmLabel class='flex items-center space-x-4'>
      <span>Dark mode</span>
      <brn-switch id='airplane' [checked]="(theme$ | async) === 'dark'" (changed)='toggleTheme()' hlm>
        <brn-switch-thumb hlm />
      </brn-switch>
    </label>
  `
})
export class HeaderComponent {
  private _themeService = inject(ThemeService);
  public theme$ = this._themeService.theme$;

  public toggleTheme() {
    this._themeService.toggle();
  }
}
