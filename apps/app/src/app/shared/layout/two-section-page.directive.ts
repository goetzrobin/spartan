import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[spartanTwoSectionPage]',
  standalone: true,
})
export class TwoSectionPageDirective {
  @HostBinding('class')
  public class = 'block relative xl:grid xl:grid-cols-[1fr_300px] xl:gap-10';
}
