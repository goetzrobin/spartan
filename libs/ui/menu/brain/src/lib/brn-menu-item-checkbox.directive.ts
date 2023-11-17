import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { booleanAttribute, Directive, HostBinding, inject, Input, Output } from '@angular/core';

@Directive({
	selector: '[brnMenuItemCheckbox]',
	standalone: true,
	hostDirectives: [CdkMenuItemCheckbox],
})
export class BrnMenuItemCheckboxDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItemCheckbox, { host: true });
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
	set disabled(value: boolean) {
		this._checked = this._cdkMenuItem.disabled = value;
	}
	@Output()
	triggered = this._cdkMenuItem.triggered;
}
