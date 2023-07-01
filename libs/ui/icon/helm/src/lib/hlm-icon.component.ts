import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  effect,
  signal,
} from '@angular/core';
import { IconName, NgIconComponent } from '@ng-icons/core';
import { hlm } from '@ng-spartan/ui/core/helm';
import { VariantProps, cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const iconVariants = cva('inline-flex', {
  variants: {
    variant: {
      xSmall: 'h-3 w-3',
      small: 'h-4 w-4',
      medium: 'h-6 w-6',
      large: 'h-8 w-8',
      xLarge: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'medium',
  },
});

type IconSize = VariantProps<typeof iconVariants>['variant'];

const generateClasses = (variant: IconSize, userCls: ClassValue) => {
  return hlm(iconVariants({ variant }), userCls);
};

@Component({
  selector: 'hlm-icon',
  standalone: true,
  imports: [NgIconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-icon size="100%" [name]="_name()" [color]="_color()" [strokeWidth]="_strokeWidth()" />`,
})
export class HlmIconComponent {
  protected readonly _name = signal<IconName | string>('');
  protected readonly _size = signal<IconSize>('medium');
  protected readonly _color = signal<string | undefined>(undefined);
  protected readonly _strokeWidth = signal<string | number | undefined>(undefined);
  protected readonly userCls = signal<ClassValue>('');

  @Input({ required: true })
  set name(value: IconName | string) {
    this._name.set(value);
  }

  @Input()
  set size(value: IconSize) {
    this._size.set(value);
  }

  @Input()
  set color(value: string | undefined) {
    this._color.set(value);
  }

  @Input()
  set strokeWidth(value: string | number | undefined) {
    this._strokeWidth.set(value);
  }

  @Input()
  set class(cls: ClassValue) {
    this.userCls.set(cls);
  }

  @HostBinding('class')
  protected cls = generateClasses(this._size(), this.userCls());

  constructor() {
    effect(() => {
      this.cls = generateClasses(this._size(), this.userCls());
    });
  }
}
