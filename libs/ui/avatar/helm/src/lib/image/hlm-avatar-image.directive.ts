import { computed, Directive, inject, Input, signal } from '@angular/core';
import { BrnAvatarImageDirective } from '@spartan-ng/ui-avatar-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'img[hlmAvatarImage]',
	standalone: true,
	exportAs: 'avatarImage',
	hostDirectives: [BrnAvatarImageDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAvatarImageDirective {
	canShow = inject(BrnAvatarImageDirective).canShow;

	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => {
		return hlm('aspect-square object-cover h-full w-full', this._userCls());
	});
}
