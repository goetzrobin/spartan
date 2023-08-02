import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const cardVariants = cva(
  'rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-card-foreground shadow-sm',
  {
    variants: {},
    defaultVariants: {},
  }
);
export type CardVariants = VariantProps<typeof cardVariants>;

@Directive({
  selector: '[hlmCard]',
  standalone: true,
})
export class HlmCardDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class') _class = this.generateClasses();

  private generateClasses() {
    return hlm(cardVariants(), this._inputs);
  }
}
