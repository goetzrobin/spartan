import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const inputVariants = cva(
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
})
export class HlmInputDirective {
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

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(inputVariants({ size: this._size(), error: this._error() }), this._userCls());
	}
}
