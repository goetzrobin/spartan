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
      },
      error: {
        auto: '[&:has([hlmInput].ng-invalid.ng-touched)]:text-destructive',
        true: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
      error: 'auto',
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

  private _error: LabelVariants['error'] = 'auto';
  @Input()
  get error(): LabelVariants['error'] {
    return this._error;
  }

  set error(value: LabelVariants['error']) {
    this._error = value;
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
    return hlm(labelVariants({ variant: this._variant, error: this._error }), this._inputs);
  }
}
