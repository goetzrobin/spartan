import { Component } from '@angular/core';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetOverlayComponent,
  BrnSheetTriggerDirective,
} from '@ng-spartan/ui/sheet/brain';
import { HlmSheetCloseDirective, HlmSheetContentDirective, HlmSheetOverlayDirective } from '@ng-spartan/ui/sheet/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixCross1, radixViewVertical } from '@ng-icons/radix-icons';
import { SideNavContentComponent } from '~/app/shared/layout/side-nav/side-nav-content.component';
import { HlmScrollAreaComponent } from '@ng-spartan/ui/scroll-area/helm';
import { RouterLink } from '@angular/router';
import { NavLinkDirective } from '~/app/shared/spartan-nav-link.directive';
import { SideNavLinkDirective } from '~/app/shared/layout/side-nav/side-nav-link.directive';

@Component({
  selector: 'spartan-mobile-nav',
  standalone: true,
  imports: [
    BrnSheetComponent,
    BrnSheetOverlayComponent,
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    BrnSheetCloseDirective,

    HlmSheetCloseDirective,
    HlmSheetOverlayDirective,
    HlmSheetContentDirective,

    HlmButtonDirective,
    HlmIconComponent,
    SideNavContentComponent,
    HlmScrollAreaComponent,
    RouterLink,
    NavLinkDirective,
    SideNavLinkDirective,
  ],
  providers: [provideIcons({ radixViewVertical, radixCross1 })],
  template: `
    <brn-sheet side="left" closeDelay="100">
      <button size="sm" id="menu-trigger" variant="ghost" brnSheetTrigger hlmBtn>
        <hlm-icon name="radixViewVertical" size="sm" />
        <span class="sr-only">Open menu</span>
      </button>
      <brn-sheet-overlay hlm />
      <div hlmSheetContent class="pb-0 pr-0" *brnSheetContent="let ctx">
        <div class="flex items-center pb-2">
          <a (click)="ctx.close()" hlmBtn variant="ghost" class="mr-2 rounded-full h-10 w-10 p-1.5" routerLink="/">
            <svg
              class="h-full w-full text-destructive"
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
          </a>
          <span>spartan/ui</span>
        </div>
        <hlm-scroll-area class="h-[calc(100vh-8rem)]">
          <div class="pb-4 flex flex-col space-y-1">
            <a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/documentation">
              Documentation
            </a>
            <a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/stack"> Stack </a>
            <a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/components">
              Components
            </a>
            <a (click)="ctx.close()" class="text-foreground px-2 py-1 hover:underline" routerLink="/examples">
              Examples
            </a>
          </div>
          <spartan-side-nav-content (linkClicked)="ctx.close()" />
        </hlm-scroll-area>
        <button brnSheetClose hlm>
          <span class="sr-only">Close</span>
          <hlm-icon class="flex h-4 w-4" name="radixCross1" />
        </button>
      </div>
    </brn-sheet>
  `,
})
export class HeaderMobileNavComponent {}
