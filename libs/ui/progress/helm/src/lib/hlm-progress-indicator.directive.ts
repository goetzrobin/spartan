import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Input,
  Renderer2,
  signal,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmProgressIndicator],brn-progress-indicator[hlm]',
  standalone: true,
})
export class HlmProgressIndicatorDirective implements DoCheck {
  private _cdr = inject(ChangeDetectorRef);
  private _element = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _value = signal(0);
  private _inputs: ClassValue = '';
  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }
  @HostBinding('class')
  private _class = this.generateClasses();

  constructor() {
    effect(() => {
      // using renderer directly as hostbinding is one change detection cycle behind
      const currentValue = this._value();
      this._renderer.setStyle(this._element.nativeElement, 'transform', `translateX(-${100 - (currentValue || 100)}%)`);
      if (!currentValue) {
        this._renderer.addClass(this._element.nativeElement, 'animate-indeterminate');
      } else {
        this._renderer.removeClass(this._element.nativeElement, 'animate-indeterminate');
      }
    });
  }

  ngDoCheck(): void {
    this._value.set(this._element.nativeElement.getAttribute('data-value'));
  }

  private generateClasses() {
    return hlm('inline-flex transform-gpu h-full w-full flex-1 bg-primary transition-all', this._inputs);
  }
}
