import { Directive } from '@angular/core';
import { CdkMenuGroup } from '@angular/cdk/menu';

@Directive({
  selector: '[brnMenuGroup]',
  standalone: true,
  hostDirectives: [CdkMenuGroup],
})
export class BrnMenuGroupDirective {}
