import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavLinkDirective } from '../spartan-nav-link.directive';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixGithubLogo, radixTwitterLogo } from '@ng-icons/radix-icons';
import { HeaderThemePickerComponent } from './header-theme-picker.component';
import { HeaderMobileNavComponent } from '~/app/shared/header/header-mobile-nav.component';
import { HeaderDarkModeComponent } from '~/app/shared/header/header-dark-mode.component';
import { SpartanLogoComponent } from '~/app/shared/spartan-logo.component';

@Component({
  selector: 'spartan-header',
  standalone: true,
  imports: [
    HlmButtonDirective,
    RouterLink,
    HlmIconComponent,
    HeaderThemePickerComponent,
    NavLinkDirective,
    HeaderMobileNavComponent,
    HeaderDarkModeComponent,
    SpartanLogoComponent,
  ],
  providers: [provideIcons({ radixTwitterLogo, radixGithubLogo })],
  host: {
    class: 'block sticky w-full top-0 z-40 bg-background/95 bg-blur-lg p-2 sm:px-4 border-b border-border',
  },
  template: `
    <div class="flex justify-between items-center w-full max-w-screen-xl mx-auto">
      <nav class="flex items-center">
        <a hlmBtn variant="ghost" class="hidden sm:flex mr-3 w-12 p-1.5" routerLink="/">
          <spartan-logo class="text-primary" />
          <span class="sr-only">spartan</span>
        </a>

        <spartan-mobile-nav class="sm:hidden" />

        <div class="hidden sm:flex sm:space-x-2">
          <a spartanNavLink="/documentation"> Documentation </a>
          <a spartanNavLink="/stack"> Stack </a>
          <a spartanNavLink="/components"> Components </a>
          <a spartanNavLink="/examples"> Examples </a>
        </div>
      </nav>

      <div class="flex space-x-2">
        <a href="https://twitter.com/goetzrobin" target="_blank" size="sm" variant="ghost" hlmBtn>
          <span class="sr-only">Twitter</span>
          <hlm-icon name="radixTwitterLogo" size="sm" />
        </a>
        <a href="https://github.com/goetzrobin/spartan" target="_blank" size="sm" variant="ghost" hlmBtn>
          <span class="sr-only">Github</span>
          <hlm-icon name="radixGithubLogo" size="sm" />
        </a>
        <spartan-theme-picker />
        <spartan-dark-mode />
      </div>
    </div>
  `,
})
export class HeaderComponent {}
