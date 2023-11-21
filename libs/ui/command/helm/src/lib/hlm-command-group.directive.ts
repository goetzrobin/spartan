import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-cmd-group[hlm],cmdk-group[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandGroupDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'block [&[cmdk-hidden="true"]]:hidden\n' +
				'[&_.cmdk-group-label]:px-2 [&_.cmdk-group-label]:py-1.5 [&_.cmdk-group-label]:text-xs [&_.cmdk-group-label]:font-medium [&_.cmdk-group-label]:text-muted-foreground\n' +
				'[&_.cmdk-group-content]:flex [&_.cmdk-group-content]:flex-col [&_.cmdk-group-content]:flex-col overflow-hidden p-1 text-foreground',
			this._userCls(),
		);
	}
}
