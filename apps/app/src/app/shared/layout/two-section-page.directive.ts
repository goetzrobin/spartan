import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[spartanTwoSectionPage]',
  standalone: true,
})
export class TwoSectionPageDirective {
  @HostBinding('class')
  public class = 'flex relative xl:gap-10';
}
