import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BrnSelectService } from './brn-select.service';

@Component({
	selector: 'brn-select-value, hlm-select-value',
	template: `
		{{ value || placeholder() }}
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
	public value: string | null = null;

	@Input()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public transformFn: (values: (string | undefined)[]) => any = (values) => (values ?? []).join(', ');

	constructor() {
		const cdr = inject(ChangeDetectorRef);

		// In certain cases (when using a computed signal for value) where the value of the select and the options are
		// changed dynamically, the template does not update until the next frame. To work around this we can use a simple
		// string variable in the template and manually trigger change detection when we update it.
		toObservable(this._selectService.selectedOptions)
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				if (value.length === 0) {
					this.value = null;
					cdr.detectChanges();
					return;
				}
				const selectedLabels = value.map((selectedOption) => selectedOption?.getLabel());

				if (this._selectService.dir() === 'rtl') {
					selectedLabels.reverse();
				}
				const result = this.transformFn(selectedLabels);
				this.value = result;
				cdr.detectChanges();
			});
	}
}
