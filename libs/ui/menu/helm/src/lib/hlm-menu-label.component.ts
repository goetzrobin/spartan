import { booleanAttribute, Component, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-label',
	standalone: true,
	template: `
		<ng-content />
	`,
})
export class HlmMenuLabelComponent {
	@HostBinding('class')
	private _class = this.generateClass();
	private _inputs: ClassValue = '';

	@Input()
	set class(inputs: ClassValue) {
		this._inputs = inputs;
		this._class = this.generateClass();
	}

	private _inset = false;
	@Input({ transform: booleanAttribute })
	set inset(value: boolean) {
		this._inset = value;
		this._class = this.generateClass();
	}

	generateClass() {
		return hlm('block px-2 py-1.5 text-sm font-semibold', this._inset && 'pl-10', this._inputs);
	}
}
