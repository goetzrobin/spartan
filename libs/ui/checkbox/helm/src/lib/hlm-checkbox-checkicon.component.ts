import { Component, computed, inject, Input, signal } from '@angular/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-checkbox-checkicon',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ radixCheck })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<hlm-icon size="sm" name="radixCheck" />
	`,
})
export class HlmCheckboxCheckIconComponent {
	private _brnCheckbox = inject(BrnCheckboxComponent);
	protected _checked = this._brnCheckbox?.isChecked;
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'h-4 w-4 leading-none group-data-[state=unchecked]:opacity-0',
			this._checked() === 'indeterminate' ? 'opacity-50' : '',
			this._userCls(),
		);
	}
}
