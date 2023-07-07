import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[spartanContainer]',
  standalone: true,
})
export class ContainerDirective {
  @HostBinding('class')
  public class =
    'flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10';
}
