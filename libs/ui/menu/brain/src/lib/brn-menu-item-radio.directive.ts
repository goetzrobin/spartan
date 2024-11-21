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
	readonly #cdkMenuItem = inject(CdkMenuItemRadio);
	public readonly checked = input(this.#cdkMenuItem.checked, { transform: booleanAttribute });
	public readonly disabled = input(this.#cdkMenuItem.disabled, { transform: booleanAttribute });
	public readonly triggered = outputFromObservable(this.#cdkMenuItem.triggered);

	constructor() {
		effect(() => (this.#cdkMenuItem.disabled = this.disabled()));

		effect(() => (this.#cdkMenuItem.checked = this.checked()));
	}
}
