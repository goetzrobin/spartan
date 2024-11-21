import { CdkMenuItem } from '@angular/cdk/menu';
import { Directive, Input, Output, booleanAttribute, inject, signal } from '@angular/core';

@Directive({
	selector: '[brnMenuItem]',
	standalone: true,
	hostDirectives: [CdkMenuItem],
	host: {
		'[disabled]': '_disabled()',
	},
})
export class BrnMenuItemDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItem, { host: true });

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
