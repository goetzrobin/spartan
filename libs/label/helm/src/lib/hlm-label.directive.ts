import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan/core/helm';
import { ClassValue } from 'clsx';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {},
    defaultVariants: {}
  }
);
export type LabelVariants = VariantProps<typeof labelVariants>

@Directive({
  selector: '[hlmLabel]',
  standalone: true
})
export class HlmLabelDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(labels: ClassValue) {
    this._inputs = labels;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(labelVariants(), this._inputs);
  }
}
