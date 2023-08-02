import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const alertTitleVariants = cva('mb-1 font-medium leading-none tracking-tight', {
  variants: {},
});
export type AlertTitleVariants = VariantProps<typeof alertTitleVariants>;

@Directive({
  selector: '[hlmAlertTitle]',
  standalone: true,
})
export class HlmAlertTitleDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(alertTitleVariants(), this._inputs);
  }
}
