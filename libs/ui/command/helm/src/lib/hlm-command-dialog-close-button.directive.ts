import { Directive, HostBinding, inject, Input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCmdDialogCloseBtn]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
})
export class HlmCommandDialogCloseButtonDirective {
	private _hlmBtn = inject(HlmButtonDirective, { host: true });
	constructor() {
		this._hlmBtn.variant = 'ghost';
	}

	@HostBinding('class')
	private _class = this.generateClass();
	private _inputs: ClassValue = '';

	@Input()
	set class(inputs: ClassValue) {
		this._inputs = inputs;
		this._class = this.generateClass();
	}

	generateClass() {
		return hlm('!p-1 !h-5 !w-5', this._inputs);
	}
}
