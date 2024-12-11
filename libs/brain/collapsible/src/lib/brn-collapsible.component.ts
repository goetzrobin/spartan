import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	input,
	signal,
} from '@angular/core';

let collapsibleContentIdSequence = 0;
export type BrnCollapsibleState = 'open' | 'closed';

@Component({
	selector: 'brn-collapsible',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.disabled]': 'attrDisabled()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnCollapsibleComponent {
	public readonly state = signal<BrnCollapsibleState>('closed');

	public readonly contentId = signal(`brn-collapsible-content-${collapsibleContentIdSequence++}`);

	public readonly disabled = input(false, { transform: booleanAttribute });

	public readonly attrDisabled = computed(() => (this.disabled() ? true : undefined));

	public toggle() {
		this.state.set(this.state() === 'closed' ? 'open' : 'closed');
	}
}
