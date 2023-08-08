import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const inputVariants = cva(
  'flex rounded-md border font-normal border-input bg-transparent text-sm ring-offset-background file:border-0 file:text-foreground file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
  selector: '[hlmInput]',
  standalone: true,
})
export class HlmInputDirective {
  private _size: InputVariants['size'] = 'default';
  @Input()
  get size(): InputVariants['size'] {
    return this._size;
  }

  set size(value: InputVariants['size']) {
    this._size = value;
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
    return hlm(inputVariants({ size: this._size }), this._inputs);
  }
}
