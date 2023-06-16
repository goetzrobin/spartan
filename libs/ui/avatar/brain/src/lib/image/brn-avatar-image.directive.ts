import { Directive, HostListener, computed, signal } from '@angular/core';

@Directive({
  selector: 'img[brnAvatarImage]',
  standalone: true,
  exportAs: 'avatarImage',
})
export class BrnAvatarImageDirective {
  private readonly error = signal(false);
  private readonly loaded = signal(false);

  @HostListener('error')
  private onError() {
    this.error.set(true);
  }

  @HostListener('load')
  private onLoad() {
    this.loaded.set(true);
  }

  canShow = computed(() => {
    return this.loaded() && !this.error();
  });
}
