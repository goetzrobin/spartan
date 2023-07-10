import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[spartanSideNavHeading]',
  standalone: true,
})
export class SideNavHeadingDirective {
  @HostBinding('class')
  public class = 'mb-1 rounded-md px-2 py-1 font-semibold';
}
