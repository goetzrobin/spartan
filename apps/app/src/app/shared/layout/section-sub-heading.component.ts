import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
	selector: 'spartan-section-sub-heading',
	standalone: true,
	host: {
		class: 'block pb-2',
		'[class.-mt-12]': '_first',
	},
	template: `
		<h2 class="font-heading border-border border-b pt-12 text-2xl font-semibold tracking-tight">
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
