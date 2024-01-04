import { computed, Directive, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSheetDescriptionDirective } from '@spartan-ng/ui-sheet-brain';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetDescription]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnSheetDescriptionDirective],
})
export class HlmSheetDescriptionDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('text-sm text-muted-foreground', this._userCls);
	}
}
