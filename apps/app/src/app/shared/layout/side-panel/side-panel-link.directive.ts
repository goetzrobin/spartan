import { Directive, HostBinding, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Directive({
  selector: '[spartanSidePanelLink]',
  standalone: true,
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink: spartanSidePanelLink'],
    },
    RouterLinkActive,
  ],
})
export class SidePanelLinkDirective {
  private _rlActive = inject(RouterLinkActive);
  @HostBinding('class')
  public class =
    'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground';
  constructor() {
    this._rlActive.routerLinkActive = 'font-medium !text-foreground';
  }
}
