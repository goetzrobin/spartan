import { FocusableOption } from '@angular/cdk/a11y';
import { CdkOption } from '@angular/cdk/listbox';
import { computed, Directive, ElementRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnOption]',
	standalone: true,
	hostDirectives: [CdkOption],
	host: {
		'(mouseenter)': 'hover()',
		'(blur)': 'blur()',
		'[attr.dir]': '_selectService.dir()',
	},
})
export class BrnSelectOptionDirective implements FocusableOption {
	private readonly _cdkSelectOption = inject(CdkOption, { host: true });
	protected readonly _selectService = inject(BrnSelectService);

	private readonly _selected = signal<boolean>(false);
	private readonly _focused = signal<boolean>(false);
	public readonly elementRef = inject(ElementRef);

	public readonly selected = computed(() => this._selected());
	public readonly focused = computed(() => this._focused());
	public readonly checkedState = computed(() => (this._selected() ? 'checked' : 'unchecked'));
	public readonly dir = computed(() => this._selectService.dir());

	constructor() {
		toObservable(this._selectService.value)
			.pipe(takeUntilDestroyed())
			.subscribe((selectedValues: string | string[]) => {
				if (Array.isArray(selectedValues)) {
					const itemFound = (selectedValues as Array<unknown>).find((val) => val === this._cdkSelectOption.value);
					this._selected.set(!!itemFound);
				} else {
					this._selected.set(this._cdkSelectOption.value === selectedValues);
				}
			});
	}

	@Input()
	set value(value: unknown | null) {
		this._cdkSelectOption.value = value;
	}

	@Input()
	set disabled(value: boolean) {
		this._disabled = value;
	}
	get disabled() {
		return this._disabled;
	}
	private _disabled = false;

	protected hover(): void {
		this.focus();
	}

	public focus(): void {
		this._cdkSelectOption.focus();
		this._focused.set(true);
	}

	public blur(): void {
		this._focused.set(false);
	}
}
