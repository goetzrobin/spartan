import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';

const menuVariants = cva(
  'border-border min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'my-0.5',
        menubar: 'my-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
type MenuVariants = VariantProps<typeof menuVariants>;

@Directive({
  selector: '[hlm][brnMenu]',
  standalone: true,
})
export class HlmMenuDirective {
  @HostBinding('class')
  private _class = this.generateClasses();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private _variant: MenuVariants['variant'] = 'default';
  @Input()
  set variant(value: MenuVariants['variant']) {
    this._variant = value;
    this._class = this.generateClasses();
  }

  generateClasses() {
    return hlm(menuVariants({ variant: this._variant }), this._inputs);
  }
}
