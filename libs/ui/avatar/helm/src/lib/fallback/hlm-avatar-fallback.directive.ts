import { computed, Directive, inject } from '@angular/core';
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
  host: {
    '[class]': 'generatedClasses()',
    '[style.backgroundColor]': "hex() || ''",
  },
})
export class HlmAvatarFallbackDirective {
  private readonly brn = inject(BrnAvatarFallbackDirective);
  private readonly hex = computed(() => {
    if (!this.brn.useAutoColor() || !this.brn.getTextContent()) return;
    return hexColorFor(this.brn.getTextContent());
  });

  private readonly autoColorTextCls = computed(() => generateAutoColorTextCls(this.hex()));

  protected readonly generatedClasses = computed(() => generateClasses(this.brn?.userCls(), this.autoColorTextCls()));
}
