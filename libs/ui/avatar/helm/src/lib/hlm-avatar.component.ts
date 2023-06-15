import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  effect,
  signal,
} from '@angular/core';
import { BrnAvatarComponent } from '@ng-spartan/ui/avatar/brain';
import { hlm } from '@ng-spartan/ui/core/helm';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    variant: {
      small: 'h-6 w-6',
      medium: 'h-10 w-10',
      large: 'h-14 w-14',
    },
  },
  defaultVariants: {
    variant: 'medium',
  },
});

type AvatarVariants = VariantProps<typeof avatarVariants>;

const generateClasses = (variant: AvatarVariants['variant'], userCls: ClassValue) => {
  return hlm(avatarVariants({ variant }), userCls);
};

@Component({
  selector: 'hlm-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf],
  standalone: true,
  template: `
    <ng-container *ngIf="image?.canShow(); else fallback">
      <ng-content select="[hlmAvatarImage]" />
    </ng-container>
    <ng-template #fallback>
      <ng-content select="[hlmAvatarFallback]" />
    </ng-template>
  `,
})
export class HlmAvatarComponent extends BrnAvatarComponent {
  private readonly variant = signal<AvatarVariants['variant']>('medium');
  private readonly userCls = signal<ClassValue>('');

  @Input('variant')
  set setVariant(variant: AvatarVariants['variant']) {
    this.variant.set(variant);
  }

  @Input('class')
  set setUserCls(cls: ClassValue) {
    this.userCls.set(cls);
  }

  @HostBinding('class')
  protected cls = generateClasses(this.variant(), this.userCls());

  constructor() {
    super();
    effect(() => {
      this.cls = generateClasses(this.variant(), this.userCls());
    });
  }
}
