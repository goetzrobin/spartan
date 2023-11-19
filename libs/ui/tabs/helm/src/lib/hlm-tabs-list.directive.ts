import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const listVariants = cva('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', {
	variants: {
		orientation: {
			horizontal: 'h-10 space-x-1',
			vertical: 'mt-2 flex-col h-fit space-y-1',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
});
type ListVariants = VariantProps<typeof listVariants>;

@Directive({
	selector: '[hlmTabsList]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsListDirective {
	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	private _orientation = signal<ListVariants['orientation']>('horizontal');
	@Input()
	set orientation(value: ListVariants['orientation']) {
		this._orientation.set(value);
	}

	protected _computedClass = computed(() => this.generateClass());
	generateClass() {
		return hlm(listVariants({ orientation: this._orientation() }), this._userCls());
	}
}
