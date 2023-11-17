import { CdkMenuGroup } from '@angular/cdk/menu';
import { Directive } from '@angular/core';

@Directive({
	selector: '[brnMenuGroup]',
	standalone: true,
	hostDirectives: [CdkMenuGroup],
})
export class BrnMenuGroupDirective {}
