import { FocusMonitor } from '@angular/cdk/a11y';
import { NgStyle, isPlatformBrowser } from '@angular/common';
import {
	type AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	type OnDestroy,
	Output,
	PLATFORM_ID,
	Renderer2,
	ViewChild,
	ViewEncapsulation,
	booleanAttribute,
	effect,
	forwardRef,
	inject,
	signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { ChangeFn, TouchFn } from '@spartan-ng/ui-forms-brain';

export const BRN_SWITCH_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnSwitchComponent),
	multi: true,
};

const CONTAINER_POST_FIX = '-switch';

@Component({
	selector: 'brn-switch',
	standalone: true,
	imports: [NgStyle],
	template: `
		<input
			#checkBox
			tabindex="-1"
			type="checkbox"
			role="switch"
			[id]="forChild(_id()) ?? ''"
			[name]="forChild(_name()) ?? ''"
			[value]="_checked() ? 'on' : 'off'"
			[ngStyle]="{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: -'1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				borderWidth: '0',
			}"
			[checked]="_checked()"
			[attr.aria-label]="ariaLabel"
			[attr.aria-labelledby]="ariaLabelledby"
			[attr.aria-describedby]="ariaDescribedby"
			[attr.aria-required]="required || null"
		/>
		<ng-content select="brn-switch-thumb" />
	`,
	host: {
		tabindex: '0',
		'[attr.data-state]': '_checked() ? "checked" : "unchecked"',
		'[attr.data-focus-visible]': 'focusVisible()',
		'[attr.data-focus]': 'focused()',
		'[attr.data-disabled]': '_disabled()',
		'[attr.aria-labelledby]': 'null',
		'[attr.aria-label]': 'null',
		'[attr.aria-describedby]': 'null',
		'[attr.id]': '_id()',
		'[attr.name]': '_name()',
	},
	providers: [BRN_SWITCH_VALUE_ACCESSOR],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnSwitchComponent implements AfterContentInit, OnDestroy {
	private readonly _renderer = inject(Renderer2);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _elementRef = inject(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _cdr = inject(ChangeDetectorRef);

	public readonly focusVisible = signal(false);
	public readonly focused = signal(false);

	protected readonly _checked = signal(false);
	@Input({ transform: booleanAttribute })
	set checked(value: boolean) {
		this._checked.set(value);
	}

	/** Used to set the id on the underlying input element. */

	protected readonly _id = signal<string | null>(null);
	@Input()
	set id(value: string | null) {
		if (!value) return;
		this._id.set(value + CONTAINER_POST_FIX);
	}

	/** Used to set the name attribute on the underlying input element. */
	protected readonly _name = signal<string | null>(null);
	@Input()
	set name(value: string | null) {
		if (!value) return;
		this._name.set(value + CONTAINER_POST_FIX);
	}

	/** Used to set the aria-label attribute on the underlying input element. */
	@Input('aria-label')
	ariaLabel: string | null = null;

	/** Used to set the aria-labelledby attribute on the underlying input element. */
	@Input('aria-labelledby')
	ariaLabelledby: string | null = null;

	/** Used to set the aria-describedby attribute on the underlying input element. */
	@Input('aria-describedby')
	ariaDescribedby: string | null = null;

	@Input({ transform: booleanAttribute })
	required = false;

	protected readonly _disabled = signal(false);
	@Input({ transform: booleanAttribute })
	set disabled(value: boolean) {
		this._disabled.set(value);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected _onChange: ChangeFn<boolean> = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onTouched: TouchFn = () => {};

	@ViewChild('checkBox', { static: true })
	public checkbox?: ElementRef<HTMLInputElement>;

	@Output()
	public readonly changed = new EventEmitter<boolean>();
	@Output()
	public readonly touched = new EventEmitter<void>();

	constructor() {
		rxHostPressedListener().subscribe(() => this.handleChange());
		effect(() => {
			/** search for the label and set the disabled state */
			let parent = this._renderer.parentNode(this._elementRef.nativeElement);
			if (!parent) return;
			// if parent is a HLM-SWITCH, then we need to go up one more level to get the label
			if (parent?.tagName === 'HLM-SWITCH') {
				parent = this._renderer.parentNode(parent);
			}
			if (!parent) return;
			// check if parent is a label and assume it is for this checkbox
			if (parent?.tagName === 'LABEL') {
				this._renderer.setAttribute(parent, 'data-disabled', this._disabled() ? 'true' : 'false');
				return;
			}
			if (!this._isBrowser) return;

			const label = parent?.querySelector(`label[for="${this.forChild(this._id())}"]`);
			if (!label) return;
			this._renderer.setAttribute(label, 'data-disabled', this._disabled() ? 'true' : 'false');
		});
	}

	handleChange() {
		if (this._disabled()) return;
		const previousChecked = this._checked();
		if (!this.checkbox) return;
		this._checked.set(!previousChecked);
		this._onChange(!previousChecked);
		this.changed.emit(!previousChecked);
	}

	ngAfterContentInit() {
		this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
			if (focusOrigin) this.focused.set(true);
			if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
				this.focusVisible.set(true);
				this._cdr.markForCheck();
			}
			if (!focusOrigin) {
				// When a focused element becomes disabled, the browser *immediately* fires a blur event.
				// Angular does not expect events to be raised during change detection, so any state
				// change (such as a form control's ng-touched) will cause a changed-after-checked error.
				// See https://github.com/angular/angular/issues/17793. To work around this, we defer
				// telling the form control it has been touched until the next tick.
				Promise.resolve().then(() => {
					this.focusVisible.set(false);
					this.focused.set(false);
					this._onTouched();
					this.touched.emit();
					this._cdr.markForCheck();
				});
			}
		});

		if (!this.checkbox) return;
		this.checkbox.nativeElement.value = this._checked() ? 'on' : 'off';
		this.checkbox.nativeElement.dispatchEvent(new Event('change'));
	}

	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	protected forChild(parentValue: string | null | undefined): string | null {
		return parentValue ? parentValue.replace(CONTAINER_POST_FIX, '') : null;
	}

	writeValue(value: boolean): void {
		this.checked = !!value;
	}

	registerOnChange(fn: ChangeFn<boolean>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	/** Implemented as a part of ControlValueAccessor. */
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this._cdr.markForCheck();
	}

	/**
	 * If the space key is pressed, prevent the default action to stop the page from scrolling.
	 */
	@HostListener('keydown.space', ['$event'])
	protected preventScrolling(event: KeyboardEvent): void {
		event.preventDefault();
	}
}
