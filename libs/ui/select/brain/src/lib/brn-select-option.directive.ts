import type { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { CdkOption } from '@angular/cdk/listbox';
import { AfterContentChecked, Directive, ElementRef, booleanAttribute, computed, effect, inject, input, signal } from '@angular/core';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnOption]',
	standalone: true,
	hostDirectives: [CdkOption],
	host: {
		'(mouseenter)': 'hover()',
		'(blur)': 'blur()',
		'[attr.dir]': '_selectService.dir()',
		'[attr.data-disabled]': "disabledSignal() ? '' : undefined",
	},
})
export class BrnSelectOptionDirective implements FocusableOption, AfterContentChecked {
	private readonly _cdkSelectOption = inject(CdkOption, { host: true });
	protected readonly _selectService = inject(BrnSelectService);

	private readonly _focused = signal<boolean>(false);
	public readonly elementRef = inject(ElementRef);

	public readonly selected = computed(() => {
		if (Array.isArray(this._selectService.value())) {
			const itemFound = (this._selectService.value() as Array<unknown>).find(
				(val) => val === this._cdkSelectOption.value,
			);
			return !!itemFound;
		}
		return this._cdkSelectOption.value === this._selectService.value();
	});
	public readonly focused = computed(() => this._focused());
	public readonly checkedState = computed(() => (this.selected() ? 'checked' : 'unchecked'));
	public readonly dir = computed(() => this._selectService.dir());

	constructor() {
		effect(() => {
			this._cdkSelectOption.value = this.value();
		});
		effect(() => {
			this._cdkSelectOption.disabled = this.disabledSignal();
		});
	}
  ngAfterContentChecked(): void {
		this._cdkSelectOption.value = this.value();
	}

	public value = input<unknown | null>(null);

	// we use "disabledSignal" here because disabled is already defined in the FocusableOption interface
	public readonly disabledSignal = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

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
