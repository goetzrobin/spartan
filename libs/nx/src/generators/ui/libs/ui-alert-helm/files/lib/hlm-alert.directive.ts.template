import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const alertVariants = cva(
  'relative w-full rounded-lg border border-border p-4 [&>[hlmAlertIcon]]:absolute [&>[hlmAlertIcon]]:text-foreground [&>[hlmAlertIcon]]:left-4 [&>[hlmAlertIcon]]:top-4 [&>[hlmAlertIcon]+div]:translate-y-[-3px] [&>[hlmAlertIcon]~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'text-destructive border-destructive/50 dark:border-destructive [&>[hlmAlertIcon]]:text-destructive text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
export type AlertVariants = VariantProps<typeof alertVariants>;

@Directive({
  selector: '[hlmAlert]',
  standalone: true,
  host: {
    role: 'alert',
  },
})
export class HlmAlertDirective {
  private _variant: AlertVariants['variant'] = 'default';
  @Input()
  get variant(): AlertVariants['variant'] {
    return this._variant;
  }

  set variant(variant: AlertVariants['variant']) {
    this._variant = variant;
    this._class = this.generateClasses();
  }

  set size(value: AlertVariants['variant']) {
    this._variant = value;
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
    return hlm(alertVariants({ variant: this._variant }), this._inputs);
  }
}
