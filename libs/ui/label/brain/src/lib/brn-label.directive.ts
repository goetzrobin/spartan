import { Directive, HostBinding, Input, signal } from '@angular/core';

let nextId = 0;

@Directive({
	selector: '[brnLabel]',
	standalone: true,
})
export class BrnLabelDirective {
	@HostBinding('id')
	get elementId() {
		return this._id();
	}

	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('id')
	set id(id: string) {
		this._id.set(id || this._id());
	}
	get id() {
		return this._id();
	}
	readonly _id = signal(`brn-label-${nextId++}`);
}
