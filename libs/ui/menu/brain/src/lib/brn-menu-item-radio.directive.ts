import { CdkMenuItemRadio } from '@angular/cdk/menu';
import { Directive, Input, Output, booleanAttribute, inject, signal } from '@angular/core';

@Directive({
	selector: '[brnMenuItemRadio]',
	standalone: true,
	hostDirectives: [CdkMenuItemRadio],
	host: {
		'[class.checked]': '_checked()',
		'[disabled]': '_disabled()',
	},
})
export class BrnMenuItemRadioDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItemRadio, { host: true });

	protected readonly _checked = signal(this._cdkMenuItem.checked);
	@Input({ transform: booleanAttribute })
	public set checked(value: boolean) {
		this._cdkMenuItem.checked = value;
		this._checked.set(value);
	}
	public get checked() {
		return this._checked();
	}

	protected readonly _disabled = signal(this._cdkMenuItem.disabled);
	@Input({ transform: booleanAttribute })
	public set disabled(value: boolean) {
		this._cdkMenuItem.disabled = value;
		this._disabled.set(value);
	}
	public get disabled() {
		return this._disabled();
	}

	@Output()
	public readonly triggered = this._cdkMenuItem.triggered;
}
