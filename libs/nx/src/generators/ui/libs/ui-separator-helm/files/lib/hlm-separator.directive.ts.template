import { Directive, HostBinding, Input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export type HlmSeparatorOrientation = 'horizontal' | 'vertical';
@Directive({
  selector: '[hlmSeparator],brn-separator[hlm]',
  standalone: true,
})
export class HlmSeparatorDirective {
  private _orientation: HlmSeparatorOrientation = 'horizontal';
  @Input()
  get orientation(): HlmSeparatorOrientation {
    return this._orientation;
  }

  set orientation(value: HlmSeparatorOrientation) {
    this._orientation = value;
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
    return hlm(
      'inline-flex shrink-0 border-0 bg-border',
      this._orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      this._inputs
    );
  }
}
