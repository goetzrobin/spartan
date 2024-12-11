import { CdkMenuItemRadio } from '@angular/cdk/menu';
import { booleanAttribute, Directive, effect, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Directive({
	selector: '[brnMenuItemRadio]',
	standalone: true,
	hostDirectives: [CdkMenuItemRadio],
	host: {
		'[class.checked]': 'checked()',
		'[disabled]': 'disabled()',
	},
})
export class BrnMenuItemRadioDirective {
	private readonly _cdkMenuItem = inject(CdkMenuItemRadio);
	public readonly checked = input(this._cdkMenuItem.checked, { transform: booleanAttribute });
	public readonly disabled = input(this._cdkMenuItem.disabled, { transform: booleanAttribute });
	public readonly triggered = outputFromObservable(this._cdkMenuItem.triggered);

	constructor() {
		effect(() => (this._cdkMenuItem.disabled = this.disabled()));
		effect(() => (this._cdkMenuItem.checked = this.checked()));
	}
}
