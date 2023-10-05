import { Directive, effect, ElementRef, HostBinding, inject, Input, Renderer2, signal } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/ui-core';

@Directive({ selector: '[hlmHoverCardContent]', standalone: true })
export class HlmHoverCardContentDirective {
  private readonly _renderer = inject(Renderer2);
  private readonly _element = inject(ElementRef);
  private readonly _statusProvider = injectExposesStateProvider({ host: true });
  private readonly _sideProvider = injectExposedSideProvider({ host: true });

  private _inputs: ClassValue = '';

  public readonly state = this._statusProvider?.state ?? signal('closed').asReadonly();
  public readonly side = this._sideProvider?.side ?? signal('bottom').asReadonly();

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
      this._renderer.setAttribute(this._element.nativeElement, 'data-side', this.side());
    });
  }

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(
      'z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      this._inputs
    );
  }
}
