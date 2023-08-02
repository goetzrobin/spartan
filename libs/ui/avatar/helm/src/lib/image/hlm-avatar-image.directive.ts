import { Directive, effect, HostBinding, inject, Input, signal } from '@angular/core';
import { BrnAvatarImageDirective } from '@spartan-ng/ui-avatar-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const generateClasses = (userCls: ClassValue) => {
  return hlm('aspect-square object-cover h-full w-full', userCls);
};

@Directive({
  selector: 'img[hlmAvatarImage]',
  standalone: true,
  exportAs: 'avatarImage',
  hostDirectives: [BrnAvatarImageDirective],
})
export class HlmAvatarImageDirective {
  private readonly userCls = signal<ClassValue>('');
  canShow = inject(BrnAvatarImageDirective).canShow;

  @Input()
  set class(cls: ClassValue) {
    this.userCls.set(cls);
  }

  @HostBinding('class')
  protected cls = generateClasses(this.userCls());

  constructor() {
    effect(() => {
      const cls = this.userCls();
      Promise.resolve().then(() => {
        this.cls = generateClasses(cls);
      });
    });
  }
}
