import { FocusableOption } from '@angular/cdk/a11y';
import { CdkOption } from '@angular/cdk/listbox';
import { Directive, ElementRef, Input, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnOption]',
	standalone: true,
	hostDirectives: [CdkOption],
	host: {
		'(mouseenter)': 'hover()',
	},
})
export class BrnSelectOptionDirective implements FocusableOption {
	private _selectService = inject(BrnSelectService);
	private _cdkSelectOption = inject(CdkOption, { host: true });

	private elementRef = inject(ElementRef);
	private _selected = signal<boolean>(false);

	selected = computed(() => this._selected());
	checkedState = computed(() => (this._selected() ? 'checked' : 'unchecked'));

	constructor() {
		toObservable(this._selectService.value)
			.pipe(
				tap((selectedValues: string | string[]) => {
					if (Array.isArray(selectedValues)) {
						const itemFound = (selectedValues as Array<unknown>).find((val) => val === this._cdkSelectOption.value);
						this._selected.set(!!itemFound);
					} else {
						this._selected.set(this._cdkSelectOption.value === selectedValues);
					}
				}),
				takeUntilDestroyed(),
			)
			.subscribe();
	}

	protected hover(): void {
		this._cdkSelectOption.focus();
	}

	@Input()
	set value(value: unknown | null) {
		this._cdkSelectOption.value = value;
	}

	@Input()
	set disabled(value: boolean) {
		this.disabled = value;
	}
	get disabled() {
		return this._disabled;
	}
	private _disabled = false;

	focus(): void {
		this.elementRef.nativeElement.focus();
	}
}
