import { Directive, computed, signal } from '@angular/core';

@Directive({
	selector: 'img[brnAvatarImage]',
	standalone: true,
	exportAs: 'avatarImage',
})
export class BrnAvatarImageDirective {
	private readonly loaded = signal(false);

	// @HostListener('error')
	// private onError() {
	// 	this.loaded.set(false);
	// }

	// @HostListener('load')
	// private onLoad() {
	// 	this.loaded.set(true);
	// }

	canShow = computed(() => this.loaded());
}
