import { FocusableOption } from '@angular/cdk/a11y';
import { CdkOption } from '@angular/cdk/listbox';
import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Directive({
	selector: '[brnOption]',
	standalone: true,
	hostDirectives: [CdkOption],
})
export class BrnSelectOptionDirective implements FocusableOption {
	private _cdkSelectOption = inject(CdkOption, { host: true });

	constructor() {
		this._cdkSelectOption._clicked
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				tap((val) => console.log(val)),
			)
			.subscribe();
	}

	private elementRef = inject(ElementRef);

	@HostListener('mouseenter', ['$event'])
	hover(): void {
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

	get isChecked() {
		return this._cdkSelectOption.isSelected();
	}

	get checkedState() {
		return this._cdkSelectOption.isSelected() ? 'checked' : 'unchecked';
	}

	focus(): void {
		this.elementRef.nativeElement.focus();
	}

	isSelected() {
		return this._cdkSelectOption.isSelected();
	}
}
