import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const cardHeaderVariants = cva('flex p-6', {
  variants: {
    direction: {
      row: 'flex-row items-center space-x-1.5',
      column: 'flex-col space-y-1.5',
    },
  },
  defaultVariants: {
    direction: 'column',
  },
});
export type CardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

@Directive({
  selector: '[hlmCardHeader]',
  standalone: true,
})
export class HlmCardHeaderDirective {
  private _inputs: ClassValue = '';

  private _direction: CardHeaderVariants['direction'] = 'column';
  @Input()
  set direction(value: CardHeaderVariants['direction']) {
    this._direction = value;
    this._class = this.generateClasses();
  }

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class') _class = this.generateClasses();

  private generateClasses() {
    return hlm(cardHeaderVariants({ direction: this._direction }), this._inputs);
  }
}
