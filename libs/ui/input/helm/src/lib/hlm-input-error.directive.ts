import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const inputErrorVariants = cva('text-destructive text-sm font-medium', {
  variants: {},
  defaultVariants: {},
});
export type InputErrorVariants = VariantProps<typeof inputErrorVariants>;

@Directive({
  selector: '[hlmInputError]',
  standalone: true,
})
export class HlmInputErrorDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(inputErrorVariants(), this._inputs);
  }
}
