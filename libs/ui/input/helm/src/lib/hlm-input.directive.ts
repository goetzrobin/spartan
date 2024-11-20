import { Directive, type DoCheck, Injector, computed, effect, inject, input, signal } from '@angular/core';
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
	public readonly size = input<InputVariants['size']>('default');

	public readonly error = input<InputVariants['error']>('auto');

	protected readonly state = computed(() => ({
		error: signal(this.error()),
	}));

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(inputVariants({ size: this.size(), error: this.state().error() }), this.userClass()),
	);

	private injector = inject(Injector);

	ngControl: NgControl | null = this.injector.get(NgControl, null);

	private errorStateTracker: ErrorStateTracker;

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
					this.setError(this.errorStateTracker.errorState());
				}
			},
			{ allowSignalWrites: true },
		);
	}

	ngDoCheck() {
		this.errorStateTracker.updateErrorState();
	}

	setError(error: InputVariants['error']) {
		this.state().error.set(error);
	}
}
