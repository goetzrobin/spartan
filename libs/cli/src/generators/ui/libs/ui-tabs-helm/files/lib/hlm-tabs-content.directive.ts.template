import { Directive, Input, computed, inject, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnTabsContentDirective } from '@spartan-ng/ui-tabs-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsContent]',
	standalone: true,
	hostDirectives: [BrnTabsContentDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsContentDirective {
	private readonly _brn = inject(BrnTabsContentDirective);
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	@Input('hlmTabsContent')
	set contentFor(key: string) {
		if (this._brn) {
			this._brn.contentFor = key;
		}
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			this._userCls(),
		);
	}
}
