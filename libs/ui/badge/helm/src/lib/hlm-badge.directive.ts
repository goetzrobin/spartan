import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

const badgeVariants = cva(
  'inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary border-transparent text-primary-foreground',
        secondary: 'bg-secondary border-transparent text-secondary-foreground',
        destructive: 'bg-destructive border-transparent text-destructive-foreground',
        outline: 'text-foreground border-border',
      },
      static: { true: '', false: '' },
    },
    compoundVariants: [
      {
        variant: 'default',
        static: false,
        class: 'hover:bg-primary/80',
      },
      {
        variant: 'secondary',
        static: false,
        class: 'hover:bg-secondary/80',
      },
      {
        variant: 'destructive',
        static: false,
        class: 'hover:bg-destructive/80',
      },
    ],
    defaultVariants: {
      variant: 'default',
      static: false,
    },
  }
);
type badgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[hlmBadge]',
  standalone: true,
})
export class HlmBadgeDirective {
  private _variant: badgeVariants['variant'] = 'default';
  @Input()
  get variant(): badgeVariants['variant'] {
    return this._variant;
  }

  set variant(value: badgeVariants['variant']) {
    this._variant = value;
    this._class = this.generateClasses();
  }
  private _static: badgeVariants['static'] = false;
  @Input()
  get static(): badgeVariants['static'] {
    return this._static;
  }

  set static(value: BooleanInput) {
    this._static = coerceBooleanProperty(value);
    this._class = this.generateClasses();
  }

  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(badgeVariants({ variant: this._variant, static: this._static }), this._inputs);
  }
}
