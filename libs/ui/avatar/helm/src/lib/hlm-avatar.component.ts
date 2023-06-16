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
      small: 'h-6 w-6 text-xs',
      medium: 'h-10 w-10',
      large: 'h-14 w-14 text-lg',
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
      <ng-content select="[hlmAvatarImage],[brnAvatarImage]" />
    </ng-container>
    <ng-template #fallback>
      <ng-content select="[hlmAvatarFallback],[brnAvatarFallback]" />
    </ng-template>
  `,
})
export class HlmAvatarComponent extends BrnAvatarComponent {
  private readonly _variant = signal<AvatarVariants['variant']>('medium');
  private readonly userCls = signal<ClassValue>('');

  @Input()
  set variant(variant: AvatarVariants['variant']) {
    this._variant.set(variant);
  }

  @Input()
  set class(cls: ClassValue) {
    this.userCls.set(cls);
  }

  @HostBinding('class')
  protected cls = generateClasses(this._variant(), this.userCls());

  constructor() {
    super();
    effect(() => {
      this.cls = generateClasses(this._variant(), this.userCls());
    });
  }
}
