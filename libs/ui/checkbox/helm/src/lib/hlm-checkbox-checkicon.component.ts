import { Component, computed, inject, input, Input, signal } from '@angular/core';
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
		<hlm-icon size="sm" [name]="_iconName()" />
	`,
})
export class HlmCheckboxCheckIconComponent {
	private _brnCheckbox = inject(BrnCheckboxComponent);
	protected _checked = this._brnCheckbox?.isChecked;
	// TODO - this cannot be private for some reason
	// build fails because hlm-checkbox.component.ts is giving the following error:
	// Property '_userClass' is private and only accessible within class 'HlmCheckboxCheckIconComponent'.
	// it should work as private but it doesn't
	readonly _userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _iconName = signal<string>('radixCheck');
	@Input()
	set iconName(iconName: string) {
		this._iconName.set(iconName);
	}

	protected _computedClass = computed(() =>
		hlm(
			'h-4 w-4 leading-none group-data-[state=unchecked]:opacity-0',
			this._checked() === 'indeterminate' ? 'opacity-50' : '',
			this._userClass(),
		),
	);
}
