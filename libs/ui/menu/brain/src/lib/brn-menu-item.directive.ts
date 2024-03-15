import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, Directive, inject, Input, Output, signal } from '@angular/core';

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
	set disabled(value: boolean) {
		this._cdkMenuItem.disabled = value;
		this._disabled.set(value);
	}

	get disabled() {
		return this._disabled();
	}

	@Output()
	triggered = this._cdkMenuItem.triggered;
}
