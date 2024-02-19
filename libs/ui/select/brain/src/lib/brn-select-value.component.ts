import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	template: `
		{{ value() || placeholder() }}
	`,
	host: {
		'[id]': 'id()',
	},
	styles: [
		`
			:host {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				white-space: nowrap;
				pointer-events: none;
			}
		`,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSelectValueComponent {
	private readonly _selectService = inject(BrnSelectService);

	public readonly id = computed(() => `${this._selectService.id()}--value`);
	public readonly placeholder = computed(() => this._selectService.placeholder());
	public readonly value = computed(() => {
		const value = this._selectService.selectedOptions();
		if (value.length === 0) {
			return null;
		}
		const selectedLabels = value.map((selectedOption) => selectedOption?.getLabel());

		if (this._selectService.dir() === 'rtl') {
			selectedLabels.reverse();
		}

		return this.transformFn(selectedLabels);
	});

	@Input()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transformFn: (values: (string | undefined)[]) => any = (values) => (values ?? []).join(', ');
}
