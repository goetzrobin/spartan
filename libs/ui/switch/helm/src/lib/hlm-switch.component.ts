import { Component, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@spartan-ng/ui-switch-brain';
import { ClassValue } from 'clsx';
import { HlmSwitchThumbDirective } from './hlm-switch-thumb.directive';

@Component({
	selector: 'hlm-switch',
	imports: [BrnSwitchThumbComponent, BrnSwitchComponent, HlmSwitchThumbDirective],
	standalone: true,
	host: {
		'[attr.class]': 'undefined',
	},
	template: `
		<brn-switch [class]="_computedClass()">
			<brn-switch-thumb hlm />
		</brn-switch>
	`,
})
export class HlmSwitchComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'group inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
			this._userCls(),
		);
	}
}
