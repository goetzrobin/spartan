import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { IconName, NgIconComponent } from '@ng-icons/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

const DEFINED_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', 'none'] as const;

type DefinedSizes = (typeof DEFINED_SIZES)[number];

const iconVariants = cva('inline-flex', {
  variants: {
    variant: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      base: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
      none: '',
    } satisfies Record<DefinedSizes, string>,
  },
  defaultVariants: {
    variant: 'base',
  },
});

export type IconSize = DefinedSizes | string;

const generateClasses = (size: IconSize, userCls: ClassValue) => {
  const variant = isDefinedSize(size) ? size : 'none';
  return hlm(iconVariants({ variant }), userCls);
};

const isDefinedSize = (size: IconSize): size is DefinedSizes => {
  return DEFINED_SIZES.includes(size as DefinedSizes);
};

@Component({
  selector: 'hlm-icon',
  standalone: true,
  imports: [NgIconComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-icon
    [class]="ngIconCls()"
    [size]="ngIconSize()"
    [name]="_name()"
    [color]="_color()"
    [strokeWidth]="_strokeWidth()"
  />`,
})
export class HlmIconComponent {
  protected readonly _name = signal<IconName | string>('');
  protected readonly _size = signal<IconSize>('base');
  protected readonly _color = signal<string | undefined>(undefined);
  protected readonly _strokeWidth = signal<string | number | undefined>(undefined);
  protected readonly userCls = signal<ClassValue>('');
  protected readonly ngIconSize = computed(() => (isDefinedSize(this._size()) ? '100%' : (this._size() as string)));
  protected readonly ngIconCls = signal<ClassValue>('');

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
  set ngIconClass(cls: ClassValue) {
    this.ngIconCls.set(cls);
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
