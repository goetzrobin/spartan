import { Directive } from '@angular/core';
import { CdkMenuBar } from '@angular/cdk/menu';

@Directive({
  selector: '[brnMenuBar]',
  standalone: true,
  hostDirectives: [CdkMenuBar],
})
export class BrnMenuBarDirective {}
