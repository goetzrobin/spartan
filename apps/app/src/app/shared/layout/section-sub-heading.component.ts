import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
	selector: 'spartan-section-sub-heading',
	standalone: true,
	host: {
		class: 'block pb-2',
		'[class.-mt-12]': '_first',
	},
	template: `
		<h2 class="pt-12 text-2xl font-semibold tracking-tight border-b font-heading border-border">
			<ng-content />
		</h2>
	`,
})
export class SectionSubHeadingComponent {
	protected _first = false;
	@Input({ transform: booleanAttribute })
	set first(value: boolean) {
		this._first = value;
	}
}
