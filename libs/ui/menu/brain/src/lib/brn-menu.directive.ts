import { Directive } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';

@Directive({
  selector: '[brnMenu],[brnSubMenu]',
  standalone: true,
  hostDirectives: [CdkMenu],
})
export class BrnMenuDirective {}
