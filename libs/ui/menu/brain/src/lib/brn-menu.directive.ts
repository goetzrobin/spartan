import { CdkMenu } from '@angular/cdk/menu';
import { Directive } from '@angular/core';

@Directive({
	selector: '[brnMenu],[brnSubMenu]',
	standalone: true,
	hostDirectives: [CdkMenu],
})
export class BrnMenuDirective {}
