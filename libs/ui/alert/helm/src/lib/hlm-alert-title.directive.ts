import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const alertTitleVariants = cva('mb-1 font-medium leading-none tracking-tight', {
	variants: {},
});
export type AlertTitleVariants = VariantProps<typeof alertTitleVariants>;

@Directive({
	selector: '[hlmAlertTitle]',
	standalone: true,
	host: {
		'[class]': '_generatedClasses()',
	},
})
export class HlmAlertTitleDirective {
	private _userCls = signal<ClassValue>('');
	protected _generatedClasses = computed(() => {
		return hlm(alertTitleVariants(), this._userCls());
	});

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
