import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	ViewEncapsulation,
	booleanAttribute,
	inject,
	signal,
} from '@angular/core';

let collapsibleContentIdSequence = 0;
export type BrnCollapsibleState = 'open' | 'closed';

@Component({
	selector: 'brn-collapsible',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
		'[attr.disabled]': 'collapsibleDisabled()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnCollapsibleComponent {
	private _cdr = inject(ChangeDetectorRef);
	state = signal<BrnCollapsibleState>('closed');
	contentId = signal('brn-collapsible-content-' + collapsibleContentIdSequence++);

	private readonly _disabled = signal<true | undefined>(undefined);
	@Input({ transform: booleanAttribute })
	set disabled(value: boolean) {
		this._disabled.set(value ? true : undefined);
	}
	collapsibleDisabled = this._disabled.asReadonly();

	public toggle() {
		this.state.set(this.state() === 'closed' ? 'open' : 'closed');
		this._cdr.detectChanges();
	}
}
