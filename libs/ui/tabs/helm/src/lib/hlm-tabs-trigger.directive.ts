import { Directive, Input, computed, inject, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsTriggerDirective } from '@spartan-ng/ui-tabs-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsTrigger]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnTabsTriggerDirective],
})
export class HlmTabsTriggerDirective {
	private readonly _brn = inject(BrnTabsTriggerDirective);
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	@Input('hlmTabsTrigger')
	set triggerFor(key: string) {
		if (this._brn) {
			this._brn.triggerFor = key;
		}
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
			this._userCls(),
		);
	}
}
