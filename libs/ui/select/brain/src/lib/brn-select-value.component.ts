import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	template: `
		<span>
			{{ value() && value()?.length ? value() : placeholder() }}
		</span>
	`,
	styles: [
		`
			:host {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
		`,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSelectValueComponent {
	private _selectService = inject(BrnSelectService);

	readonly _value = this._selectService.selectedOptions;
	readonly value = computed(() => {
		const selectedLabels = this._value().map((selectedOption) => selectedOption.option?.getLabel());
		return selectedLabels.join(', ');
	});

	readonly placeholder = this._selectService.placeholder;
}
