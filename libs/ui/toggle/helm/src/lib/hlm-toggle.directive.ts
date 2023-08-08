import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
type ToggleVariants = VariantProps<typeof toggleVariants>;

@Directive({
  selector: '[hlmToggle],[brnToggle][hlm]',
  standalone: true,
})
export class HlmToggleDirective {
  private _variant: ToggleVariants['variant'] = 'default';
  @Input()
  get variant(): ToggleVariants['variant'] {
    return this._variant;
  }

  set variant(value: ToggleVariants['variant']) {
    this._variant = value;
    this._class = this.generateClasses();
  }

  private _size: ToggleVariants['size'] = 'default';
  @Input()
  get size(): ToggleVariants['size'] {
    return this._size;
  }

  set size(value: ToggleVariants['size']) {
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
    return hlm(toggleVariants({ variant: this._variant, size: this._size }), this._inputs);
  }
}
