/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, ElementRef, computed, inject, signal } from '@angular/core';

const isImageElement = (el: HTMLElement): el is HTMLImageElement => el.nodeName === 'IMG';

const bindOnError = (el: HTMLElement, onError: () => void): HTMLImageElement | null => {
  if (!isImageElement(el)) return null;

  const originalOnError = (el.onerror || (() => {})).bind(el);
  el.onerror = (args) => {
    el.onerror = null;
    onError();
    originalOnError(args);
  };

  return el;
};

@Directive({
  selector: 'img[brnAvatarImage], picture[brnAvatarImage]',
  standalone: true,
  exportAs: 'avatarImage',
})
export class BrnAvatarImageDirective {
  private readonly errored = signal(false);
  private readonly imageElement = signal(bindOnError(inject(ElementRef).nativeElement, () => this.errored.set(true)));

  canShow = computed(() => {
    return !!this.imageElement()?.src && !this.errored();
  });
}
