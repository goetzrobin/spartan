import { Component, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const btnLike =
	'aspect-square rounded-full ring-offset-background group-[.cdk-keyboard-focused]:ring-2 group-[.cdk-keyboard-focused]:ring-ring group-[.cdk-keyboard-focused]:ring-offset-2 group-[.brn-radio-disabled]:cursor-not-allowed group-[.brn-radio-disabled]:opacity-50';

@Component({
	selector: 'hlm-radio-indicator',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<div
			class="bg-foreground absolute inset-0 hidden scale-[55%] rounded-full group-[.brn-radio-checked]:inline-block"
		></div>
		<div class="border-primary ${btnLike} rounded-full border"></div>
	`,
})
export class HlmRadioIndicatorComponent {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('relative inline-flex h-4 w-4', this._userCls());
	}
}
