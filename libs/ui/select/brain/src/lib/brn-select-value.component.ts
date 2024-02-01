import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
	private _selectService = inject(BrnSelectService);

	readonly id = computed(() => `${this._selectService.id()}--value`);
	readonly placeholder = computed(() => this._selectService.placeholder());
	readonly value = computed(() => {
		const value = this._selectService.selectedOptions();
		if (value.length === 0) {
			return null;
		}
		const selectedLabels = value.map((selectedOption) => selectedOption?.getLabel());
		return selectedLabels.join(', ');
	});
}
