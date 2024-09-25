import { Directive, type DoCheck, Injector, Input, computed, effect, inject, input, signal } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { hlm } from '@spartan-ng/ui-core';
import { BrnFormFieldControl } from '@spartan-ng/ui-formfield-brain';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/ui-forms-brain';

import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
	'flex rounded-md border font-normal border-input bg-transparent text-sm ring-offset-background file:border-0 file:text-foreground file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
			},
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
				true: 'text-destructive border-destructive focus-visible:ring-destructive',
			},
		},
		defaultVariants: {
			size: 'default',
			error: 'auto',
		},
	},
);
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
	selector: '[hlmInput]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: HlmInputDirective,
		},
	],
})
export class HlmInputDirective implements BrnFormFieldControl, DoCheck {
	private readonly _size = signal<InputVariants['size']>('default');
	@Input()
	set size(value: InputVariants['size']) {
		this._size.set(value);
	}

	private readonly _error = signal<InputVariants['error']>('auto');
	@Input()
	set error(value: InputVariants['error']) {
		this._error.set(value);
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(inputVariants({ size: this._size(), error: this._error() }), this.userClass()),
	);

	private injector = inject(Injector);

	ngControl: NgControl | null = this.injector.get(NgControl, null);

	errorStateTracker: ErrorStateTracker;

	private defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private parentForm = inject(NgForm, { optional: true });
	private parentFormGroup = inject(FormGroupDirective, { optional: true });

	errorState = computed(() => this.errorStateTracker.errorState());

	constructor() {
		this.errorStateTracker = new ErrorStateTracker(
			this.defaultErrorStateMatcher,
			this.ngControl,
			this.parentFormGroup,
			this.parentForm,
		);

		effect(
			() => {
				if (this.ngControl) {
					this.error = this.errorStateTracker.errorState();
				}
			},
			{ allowSignalWrites: true },
		);
	}

	ngDoCheck() {
		this.errorStateTracker.updateErrorState();
	}
}
