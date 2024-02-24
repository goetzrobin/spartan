import { computed, Directive, inject, Input, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnLabelDirective } from '@spartan-ng/ui-label-brain';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const labelVariants = cva(
	'text-sm font-medium leading-none [&>[hlmInput]]:my-1 [&:has([hlmInput]:disabled)]:cursor-not-allowed [&:has([hlmInput]:disabled)]:opacity-70',
	{
		variants: {
			variant: {
				default: '',
			},
			error: {
				auto: '[&:has([hlmInput].ng-invalid.ng-touched)]:text-destructive',
				true: 'text-destructive',
			},
			disabled: {
				auto: '[&:has([hlmInput]:disabled)]:opacity-70',
				true: 'opacity-70',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			error: 'auto',
		},
	},
);
export type LabelVariants = VariantProps<typeof labelVariants>;

@Directive({
	selector: '[hlmLabel]',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnLabelDirective,
			inputs: ['id'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLabelDirective {
	private readonly _brn = inject(BrnLabelDirective, { host: true });

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			labelVariants({
				variant: this._variant(),
				error: this._error(),
				disabled: this._brn?.dataDisabled() ?? 'auto',
			}),
			this._userClass(),
		),
	);

	private readonly _variant = signal<LabelVariants['variant']>('default');
	@Input()
	set variant(value: LabelVariants['variant']) {
		this._variant.set(value);
	}

	private readonly _error = signal<LabelVariants['error']>('auto');
	@Input()
	set error(value: LabelVariants['error']) {
		this._error.set(value);
	}
}
