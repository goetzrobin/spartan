import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { booleanAttribute, Directive, effect, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Directive({
	selector: '[brnMenuItemCheckbox]',
	standalone: true,
	hostDirectives: [CdkMenuItemCheckbox],
	host: {
		'[class.checked]': 'checked()',
		'[disabled]': 'disabled()',
	},
})
export class BrnMenuItemCheckboxDirective {
	readonly #cdkMenuItem = inject(CdkMenuItemCheckbox);
	readonly checked = input(this.#cdkMenuItem.checked, { transform: booleanAttribute });
	readonly disabled = input(this.#cdkMenuItem.disabled, { transform: booleanAttribute });
	public readonly triggered = outputFromObservable(this.#cdkMenuItem.triggered);

	constructor() {
		effect(() => (this.#cdkMenuItem.disabled = this.disabled()));

		effect(() => (this.#cdkMenuItem.checked = this.checked()));
	}
}
