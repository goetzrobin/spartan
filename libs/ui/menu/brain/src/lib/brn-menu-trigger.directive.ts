import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive } from '@angular/core';
import { BrnTriggerBase } from './brn-trigger-base';

@Directive({
	selector: '[brnMenuTriggerFor]',
	standalone: true,
	hostDirectives: [{ directive: CdkMenuTrigger, inputs: ['cdkMenuTriggerFor: brnMenuTriggerFor'] }],
})
export class BrnMenuTriggerDirective extends BrnTriggerBase {}
