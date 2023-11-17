import { Component, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-shortcut',
	standalone: true,
	template: `
		<ng-content />
	`,
})
export class HlmMenuShortcutComponent {
	@HostBinding('class')
	private _class = this.generateClass();
	private _inputs: ClassValue = '';

	@Input()
	set class(inputs: ClassValue) {
		this._inputs = inputs;
		this._class = this.generateClass();
	}

	generateClass() {
		return hlm('ml-auto font-light text-xs tracking-widest opacity-60', this._inputs);
	}
}
