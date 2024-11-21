import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { Directive, effect, input, type TemplateRef } from '@angular/core';
import { BrnTriggerBase } from './brn-trigger-base';

@Directive({
	selector: '[brnCtxMenuTriggerFor]',
	standalone: true,
	hostDirectives: [CdkContextMenuTrigger],
})
export class BrnContextMenuTriggerDirective extends BrnTriggerBase {
	public brnCtxMenuTriggerFor = input<TemplateRef<unknown> | null>(null);
	public brnCtxMenuTriggerData = input<unknown>(undefined);

	constructor() {
		super();
		effect(() => (this._cdkTrigger.menuTemplateRef = this.brnCtxMenuTriggerFor()));
		effect(() => (this._cdkTrigger.menuData = this.brnCtxMenuTriggerData()));
	}
}
