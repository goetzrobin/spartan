import { Directive, effect, ElementRef, HostBinding, inject, Input, Renderer2, signal } from '@angular/core';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAlertDialogContent],[brnAlertDialogContent][hlm]',
  standalone: true,
})
export class HlmAlertDialogContentDirective {
  private _inputs: ClassValue = '';
  private _stateProvider = injectExposesStateProvider({ optional: true, host: true });
  public state = this._stateProvider?.state ?? signal('closed');
  private _renderer = inject(Renderer2);
  private _element = inject(ElementRef);

  constructor() {
    effect(() => this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state()));
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
      'relative grid w-full max-w-lg gap-4 border-border border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg md:w-full',
      this._inputs
    );
  }
}
