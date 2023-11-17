import { booleanAttribute, Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlm][brnMenuItem], [hlm][brnMenuItemRadio], [hlm][brnMenuItemCheckbox]',
	standalone: true,
})
export class HlmMenuItemDirective {
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
		return hlm(
			'group w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
			this._inset && 'pl-10',
			this._inputs,
		);
	}
}
