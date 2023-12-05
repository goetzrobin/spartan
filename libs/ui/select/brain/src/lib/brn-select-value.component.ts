import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Component({
	selector: 'brn-select-value',
	template: `
		<span>
			{{ value() && value()?.length ? value() : placeholder() }}
		</span>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnSelectValueComponent {
	private _selectService = inject(BrnSelectService);

	readonly value = this._selectService.value;

	readonly placeholder = this._selectService.placeholder;
}
