import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const alertDescriptionVariants = cva('text-sm [&_p]:leading-relaxed', {
	variants: {},
});
export type AlertDescriptionVariants = VariantProps<typeof alertDescriptionVariants>;

@Directive({
	selector: '[hlmAlertDesc],[hlmAlertDescription]',
	standalone: true,
	host: {
		'[class]': '_generatedClasses()',
	},
})
export class HlmAlertDescriptionDirective {
	private _userCls = signal<ClassValue>('');
	protected _generatedClasses = computed(() => {
		return hlm(alertDescriptionVariants(), this._userCls());
	});

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
