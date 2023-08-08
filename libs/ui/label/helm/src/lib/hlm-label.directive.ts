import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const labelVariants = cva(
  'text-sm font-medium leading-none [&:has([hlmInput]:disabled)]:cursor-not-allowed [&:has([hlmInput]:disabled)]:opacity-70',
  {
    variants: {
      variant: {
        default: '',
        error: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  }
);
export type LabelVariants = VariantProps<typeof labelVariants>;

@Directive({
  selector: '[hlmLabel]',
  standalone: true,
})
export class HlmLabelDirective {
  private _inputs: ClassValue = '';

  private _variant: LabelVariants['variant'] = 'default';

  @Input()
  get variant(): LabelVariants['variant'] {
    return this._variant;
  }

  set variant(value: LabelVariants['variant']) {
    this._variant = value;
    this._class = this.generateClasses();
  }

  @Input()
  set class(labels: ClassValue) {
    this._inputs = labels;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(labelVariants({ variant: this._variant }), this._inputs);
  }
}
