import { Component, Input, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixCheck, radixDividerHorizontal } from '@ng-icons/radix-icons';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-checkbox-checkicon',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ radixCheck, radixDividerHorizontal })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<hlm-icon [color]="_color()" size="sm" [name]="_iconName()" />
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

	protected _iconName = computed(() => (this._checked() === 'indeterminate' ? 'radixDividerHorizontal' : 'radixCheck'));
	protected _color = computed(() =>
		this._checked() === 'indeterminate' ? 'hsl(var(--primary))' : 'hsl(var(--background))',
	);
	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('h-4 w-4 leading-none  group-data-[state=unchecked]:opacity-0', this._userCls());
	}
}
