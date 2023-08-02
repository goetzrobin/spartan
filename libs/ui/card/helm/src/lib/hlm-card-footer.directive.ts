import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const cardFooterVariants = cva('flex p-6 pt-0', {
  variants: {
    direction: {
      row: 'flex-row items-center space-x-1.5',
      column: 'flex-col space-y-1.5',
    },
  },
  defaultVariants: {
    direction: 'row',
  },
});
export type CardFooterVariants = VariantProps<typeof cardFooterVariants>;

@Directive({
  selector: '[hlmCardFooter]',
  standalone: true,
})
export class HlmCardFooterDirective {
  private _inputs: ClassValue = '';

  private _direction: CardFooterVariants['direction'] = 'row';
  @Input()
  set direction(value: CardFooterVariants['direction']) {
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
    return hlm(cardFooterVariants({ direction: this._direction }), this._inputs);
  }
}
