import { Component, Input, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-checkbox-checkicon',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ radixCheck })],
	host: {
		'[class]': '_computedClass()',
	},
	template: '<hlm-icon color="hsl(var(--background))" size="sm" name="radixCheck" />',
})
export class HlmCheckboxCheckIconComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('h-4 w-4 leading-none group-data-[state=unchecked]:opacity-0', this._userCls());
	}
}
