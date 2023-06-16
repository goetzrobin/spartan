import { Directive, inject } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appHeaderLink]',
  standalone: true,
  hostDirectives: [HlmButtonDirective, {
    directive: RouterLink,
    inputs: ['routerLink: appHeaderLink']
  }, RouterLinkActive]
})
export class HeaderLinkDirective {
  private _hlmBtn = inject(HlmButtonDirective);
  private _rlActive = inject(RouterLinkActive);

  constructor() {
    this._hlmBtn.variant = 'link';
    this._rlActive.routerLinkActiveOptions = { exact: true };
    this._rlActive.routerLinkActive = '!text-[#DD0031]';
  }
}
