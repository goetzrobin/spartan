import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsListDirective } from '@spartan-ng/ui-tabs-brain';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const listVariants = cva(
	'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
	{
		variants: {
			orientation: {
				horizontal: 'h-10 space-x-1',
				vertical: 'mt-2 flex-col h-fit space-y-1',
			},
		},
		defaultVariants: {
			orientation: 'horizontal',
		},
	},
);
type ListVariants = VariantProps<typeof listVariants>;

@Component({
	selector: 'hlm-tabs-list',
	standalone: true,
	hostDirectives: [BrnTabsListDirective],
	template: '<ng-content/>',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsListComponent {
	public readonly orientation = input<ListVariants['orientation']>('horizontal');

	public readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(listVariants({ orientation: this.orientation() }), this._userClass()));
}
