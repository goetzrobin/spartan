import { computed, Directive, inject, Input } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnSelectValue]',
	standalone: true,
})
export class BrnSelectValueDirective {
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
	transformFn: (values: (string | undefined)[]) => string = (values) => (values ?? []).join(', ');
}
