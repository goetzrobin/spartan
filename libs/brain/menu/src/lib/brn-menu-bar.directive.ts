import { CdkMenuBar } from '@angular/cdk/menu';
import { Directive } from '@angular/core';

@Directive({
	selector: '[brnMenuBar]',
	standalone: true,
	hostDirectives: [CdkMenuBar],
})
export class BrnMenuBarDirective {}
