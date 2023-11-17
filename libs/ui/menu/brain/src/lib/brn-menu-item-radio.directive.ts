import { CdkMenuItemRadio } from '@angular/cdk/menu';
import { booleanAttribute, Directive, HostBinding, inject, Input, Output } from '@angular/core';

@Directive({
	selector: '[brnMenuItemRadio]',
	standalone: true,
	hostDirectives: [CdkMenuItemRadio],
})
export class BrnMenuItemRadioDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItemRadio, { host: true });
	@HostBinding('class.checked')
	private _checked = this._cdkMenuItem.checked;
	get checked() {
		return this._checked;
	}

	@Input({ transform: booleanAttribute })
	set checked(value: boolean) {
		this._checked = this._cdkMenuItem.checked = value;
	}

	get disabled() {
		return this._cdkMenuItem.disabled;
	}

	@Input({ transform: booleanAttribute })
	set disabled(value) {
		this._cdkMenuItem.disabled = value;
	}

	@Output()
	public readonly triggered = this._cdkMenuItem.triggered;
}
