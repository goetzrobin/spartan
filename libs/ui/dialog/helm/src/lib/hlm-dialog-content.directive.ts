import { Directive, effect, ElementRef, HostBinding, inject, Input, Renderer2 } from '@angular/core';
import { hlm } from '@ng-spartan/ui/core/helm';
import { ClassValue } from 'clsx';
import { EXPOSES_STATE_TOKEN } from '@ng-spartan/ui/core/brain';

@Directive({
  selector: '[hlmDialogContent],[brnDialogContent][hlm]',
  standalone: true,
})
export class HlmDialogOverlayDirective {
  private _inputs: ClassValue = '';
  private _statusProvider = inject(EXPOSES_STATE_TOKEN, { host: true });
  public state = this._statusProvider.state;
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
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
    return hlm(
      'border-border fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
      this._inputs
    );
  }
}
