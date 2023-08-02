import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const cardTitleVariants = cva('text-lg font-semibold leading-none tracking-tight', {
  variants: {},
  defaultVariants: {},
});
export type CardTitleVariants = VariantProps<typeof cardTitleVariants>;

@Directive({
  selector: '[hlmCardTitle]',
  standalone: true,
})
export class HlmCardTitleDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class') _class = this.generateClasses();

  private generateClasses() {
    return hlm(cardTitleVariants(), this._inputs);
  }
}
