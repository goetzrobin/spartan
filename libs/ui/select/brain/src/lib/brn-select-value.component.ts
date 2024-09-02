import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
	imports: [AsyncPipe],
})
export class BrnSelectValueComponent {
	private readonly _selectService = inject(BrnSelectService);

	public readonly id = computed(() => `${this._selectService.id()}--value`);
	public readonly placeholder = computed(() => this._selectService.placeholder());
	cdr = inject(ChangeDetectorRef);

	// it's a little bit ugly, but we need to handle selectedOptions as an Observable here
	// the reason being that computed signals are only evaluated once per event loop cycle
	// and sometimes (handling initial values) we need to handle two updates per cycle
	value$ = toObservable(this._selectService.selectedOptions)
		.pipe(
			map((value) => {
				if (value.length === 0) {
					return null;
				}
				const selectedLabels = value.map((selectedOption) => selectedOption?.getLabel());

				if (this._selectService.dir() === 'rtl') {
					selectedLabels.reverse();
				}
				const result = this.transformFn(selectedLabels);
				console.log('DINGDINGDING select-value re-computed', result);
				this.value = result;
				this.cdr.detectChanges();
				return result;
			}),
		)
		.subscribe();
	value?: string = undefined;

	@Input()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	transformFn: (values: (string | undefined)[]) => any = (values) => (values ?? []).join(', ');
}
