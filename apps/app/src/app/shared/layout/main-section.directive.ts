import { Directive } from '@angular/core';

@Directive({
  selector: '[spartanMainSection]',
  standalone: true,
  host: {
    class: 'w-full h-[calc(100vh-3.5rem)]',
  },
})
export class MainSectionDirective {}
