import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * Wraps every page under `/test`. These pages are what the Playwright suite in `apps/ui-e2e`
 * runs against, so the shell does two things for it:
 *
 * - gives the case a stable root (`#test-root`) to scope queries and checks to;
 * - sets `data-test-ready` once the page has rendered in the browser, so a test never
 *   interacts with server-rendered markup that has no listeners yet.
 *
 * The header and footer are left out for these pages by the root component (`app.ts`).
 */
@Component({
	selector: 'spartan-test-shell',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		id: 'test-root',
		class: 'block p-4',
		'[attr.data-test-ready]': '_ready() ? "" : null',
	},
	template: `
		<ng-content />
	`,
})
export class SpartanTestShell {
	protected readonly _ready = signal(false);

	constructor() {
		afterNextRender(() => this._ready.set(true));
	}
}
