import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[spartanSidePanelHeading]',
  standalone: true,
})
export class SidePanelHeadingDirective {
  @HostBinding('class')
  public class = 'mb-1 rounded-md px-2 py-1 font-semibold';
}
