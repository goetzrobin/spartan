import { computed, Directive, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectContent], hlm-select-content',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectContentDirective {
	private readonly _classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this._classNames.set(classNames);
	}
	protected readonly _computedClass = computed(() =>
		hlm(
			'top-[2px] relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this._classNames(),
		),
	);

	private readonly _stickyLabels = signal(false);
	@Input()
	set stickyLabels(value: boolean) {
		this._stickyLabels.set(value);
	}
	get stickyLabels() {
		return this._stickyLabels();
	}
}
