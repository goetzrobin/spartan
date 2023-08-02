import { computed, Directive, effect, HostBinding, inject } from '@angular/core';
import { BrnAvatarFallbackDirective, hexColorFor, isBright } from '@spartan-ng/ui-avatar-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const generateClasses = (userCls: ClassValue, colorCls: ClassValue = 'bg-muted') => {
  return hlm('flex h-full w-full items-center justify-center rounded-full', colorCls, userCls);
};

const generateAutoColorTextCls = (hex?: string) => {
  if (!hex) return;
  return `${isBright(hex) ? 'text-black' : 'text-white'}`;
};

@Directive({
  selector: '[hlmAvatarFallback]',
  standalone: true,
  exportAs: 'avatarFallback',
  hostDirectives: [
    {
      directive: BrnAvatarFallbackDirective,
      inputs: ['class:class', 'autoColor:autoColor'],
    },
  ],
})
export class HlmAvatarFallbackDirective {
  private readonly brn = inject(BrnAvatarFallbackDirective);
  private readonly hex = computed(() => {
    if (!this.brn.useAutoColor() || !this.brn.textContent) return;
    return hexColorFor(this.brn.textContent);
  });

  private readonly autoColorTextCls = computed(() => generateAutoColorTextCls(this.hex()));

  @HostBinding('class')
  protected cls = generateClasses(this.brn?.userCls(), this.autoColorTextCls());

  @HostBinding('style.backgroundColor')
  protected backgroundColor = this.hex() || '';

  constructor() {
    effect(() => {
      const cls = generateClasses(this.brn.userCls(), this.autoColorTextCls());
      Promise.resolve().then(() => {
        this.cls = cls;
      });
    });
    effect(() => {
      const hex = this.hex() || '';
      Promise.resolve().then(() => {
        this.backgroundColor = hex;
      });
    });
  }
}
