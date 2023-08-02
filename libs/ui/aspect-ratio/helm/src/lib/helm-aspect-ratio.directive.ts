import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { AfterViewInit, Directive, effect, ElementRef, HostBinding, inject, Input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const generateParentClasses = (userCls: ClassValue) => hlm(`relative w-full`, userCls);

const parseDividedString = (value: NumberInput): NumberInput => {
  if (typeof value !== 'string' || !value.includes('/')) return value;
  return value
    .split('/')
    .map((v) => parseInt(v, 10))
    .reduce((a, b) => a / b);
};

@Directive({
  selector: '[hlmAspectRatio]',
  standalone: true,
})
export class HlmAspectRatioDirective implements AfterViewInit {
  private readonly ratio = signal(1);
  private readonly userCls = signal<ClassValue>('');
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly child = signal<Element | null>(this.el.firstElementChild);

  @Input()
  set hlmAspectRatio(value: NumberInput) {
    const coerced = coerceNumberProperty(parseDividedString(value));
    this.ratio.set(coerced <= 0 ? 1 : coerced);
  }

  @Input()
  set class(value: ClassValue) {
    this.userCls.set(value);
  }

  @HostBinding('class')
  protected cls = generateParentClasses(this.userCls());

  constructor() {
    effect(() => {
      this.cls = generateParentClasses(this.userCls());
    });

    effect(() => {
      this.el.style.paddingBottom = `${100 / this.ratio()}%`;
    });

    effect(() => {
      const child = this.child();
      if (!child) return;
      child.classList.add('absolute', 'w-full', 'h-full', 'object-cover');
    });
  }

  ngAfterViewInit() {
    // support delayed addition of image to dom
    if (!this.child()) this.child.set(this.el.firstElementChild);
  }
}
