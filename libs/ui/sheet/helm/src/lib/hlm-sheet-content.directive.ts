import { Directive, effect, ElementRef, HostBinding, inject, Input, Renderer2 } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core-helm';
import { ClassValue } from 'clsx';
import { EXPOSES_SIDE_TOKEN, EXPOSES_STATE_TOKEN } from '@spartan-ng/ui-core-brain';
import { cva } from 'class-variance-authority';

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'border-border inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'border-border inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'border-border inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'border-border inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

@Directive({
  selector: '[hlmSheetContent],[brnSheetContent][hlm]',
  standalone: true,
})
export class HlmSheetContentDirective {
  private _inputs: ClassValue = '';
  private _statusProvider = inject(EXPOSES_STATE_TOKEN, { host: true });
  private _sideProvider = inject(EXPOSES_SIDE_TOKEN, { host: true });
  public state = this._statusProvider.state;
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
    });
    effect(() => {
      this._sideProvider.side();
      this._class = this.generateClasses();
    });
  }

  @HostBinding('class')
  _class = this.generateClasses();
  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm(sheetVariants({ side: this._sideProvider.side() }), this._inputs);
  }
}
