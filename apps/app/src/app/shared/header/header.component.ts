import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavLinkDirective } from '../spartan-nav-link.directive';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixGithubLogo, radixTwitterLogo } from '@ng-icons/radix-icons';
import { HeaderThemePickerComponent } from './header-theme-picker.component';
import { HeaderMobileNavComponent } from '~/app/shared/header/header-mobile-nav.component';

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
  ],
  providers: [provideIcons({ radixTwitterLogo, radixGithubLogo })],
  host: {
    class: 'block sticky w-full top-0 z-40 bg-background/95 bg-blur-lg p-2 sm:px-4 border-b border-border',
  },
  template: `
    <div class="flex justify-between items-center w-full max-w-screen-xl mx-auto">
      <nav class="flex items-center">
        <a hlmBtn variant="ghost" class="hidden sm:block mr-3 rounded-full h-9 w-9 p-1.5" routerLink="/">
          <svg
            class="h-full w-full text-[#DD0031]"
            width="587"
            height="587"
            viewBox="0 0 587 587"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M293.5 66C167.855 66 66 167.855 66 293.5C66 345.005 83.088 392.483 111.949 430.623L293.5 217.629L475.051 430.623C503.912 392.483 521 345.005 521 293.5C521 167.855 419.145 66 293.5 66ZM427.916 477.068L293.5 319.371L159.084 477.068C196.752 504.705 243.2 521 293.5 521C343.8 521 390.248 504.705 427.916 477.068ZM0 293.5C0 131.404 131.404 0 293.5 0C455.596 0 587 131.404 587 293.5C587 376.362 552.619 451.25 497.432 504.579C444.66 555.574 372.716 587 293.5 587C214.284 587 142.34 555.574 89.5685 504.579C34.3812 451.25 0 376.362 0 293.5Z"
              fill="currentColor"
            />
          </svg>
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
      </div>
    </div>
  `,
})
export class HeaderComponent {}
