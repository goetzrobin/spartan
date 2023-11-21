import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const menuVariants = cva(
	'border-border min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
	{
		variants: {
			variant: {
				default: 'my-0.5',
				menubar: 'my-2',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);
type MenuVariants = VariantProps<typeof menuVariants>;

@Directive({
	selector: '[hlm][brnMenu]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	private readonly _variant = signal<MenuVariants['variant']>('default');
	@Input()
	set variant(value: MenuVariants['variant']) {
		this._variant.set(value);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(menuVariants({ variant: this._variant() }), this._userCls());
	}
}
