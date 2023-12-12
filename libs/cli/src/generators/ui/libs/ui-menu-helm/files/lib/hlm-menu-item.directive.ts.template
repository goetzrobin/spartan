import { booleanAttribute, computed, Directive, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnMenuItemDirective } from '@spartan-ng/ui-menu-brain';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const hlmMenuItemVariants = cva(
	'group w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
	{
		variants: { inset: { true: 'pl-10', false: '' } },
		defaultVariants: { inset: false },
	},
);
export type HlmMenuItemVariants = VariantProps<typeof hlmMenuItemVariants>;

@Directive({
	selector: '[hlmMenuItem]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [
		{
			directive: BrnMenuItemDirective,
			inputs: ['disabled: disabled'],
			outputs: ['triggered: triggered'],
		},
	],
})
export class HlmMenuItemDirective {
	private readonly _inset = signal<boolean>(false);

	private readonly _userCls = signal<ClassValue>('');

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	@Input({ transform: booleanAttribute })
	set inset(value: boolean) {
		this._inset.set(value);
	}

	protected _computedClass = computed(() => this._generateClass());

	private _generateClass() {
		return hlm(hlmMenuItemVariants({ inset: this._inset() }), this._userCls());
	}
}
