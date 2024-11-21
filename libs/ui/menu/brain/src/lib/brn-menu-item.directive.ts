import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, Directive, effect, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Directive({
	selector: '[brnMenuItem]',
	standalone: true,
	hostDirectives: [CdkMenuItem],
	host: {
		'[disabled]': 'disabled()',
	},
})
export class BrnMenuItemDirective {
	readonly #cdkMenuItem = inject(CdkMenuItem);
	readonly disabled = input(this.#cdkMenuItem.disabled, { transform: booleanAttribute });
	public readonly triggered = outputFromObservable(this.#cdkMenuItem.triggered);

	constructor() {
		effect(() => (this.#cdkMenuItem.disabled = this.disabled()));
	}
}
