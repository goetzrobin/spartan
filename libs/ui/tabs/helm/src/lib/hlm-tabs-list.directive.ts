import { Directive, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';
import { cva, VariantProps } from 'class-variance-authority';

const listVariants = cva('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', {
  variants: {
    orientation: {
      horizontal: 'h-10 space-x-1',
      vertical: 'mt-2 flex-col h-fit space-y-1',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
type ListVariants = VariantProps<typeof listVariants>;

@Directive({
  selector: '[hlmTabsList]',
  standalone: true,
  host: {},
})
export class HlmTabsListDirective {
  @HostBinding('class')
  private _class = this.generateClass();

  private _inputs: ClassValue = '';
  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  private _orientation: ListVariants['orientation'] = 'horizontal';
  @Input()
  get orientation(): ListVariants['orientation'] {
    return this._orientation;
  }

  set orientation(value: ListVariants['orientation']) {
    this._orientation = value;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm(listVariants({ orientation: this._orientation }), this._inputs);
  }
}
