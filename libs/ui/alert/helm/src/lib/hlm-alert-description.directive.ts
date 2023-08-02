import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const alertDescriptionVariants = cva('text-sm [&_p]:leading-relaxed', {
  variants: {},
});
export type AlertDescriptionVariants = VariantProps<typeof alertDescriptionVariants>;

@Directive({
  selector: '[hlmAlertDesc],[hlmAlertDescription]',
  standalone: true,
})
export class HlmAlertDescriptionDirective {
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  @HostBinding('class')
  private _class = this.generateClasses();

  private generateClasses() {
    return hlm(alertDescriptionVariants(), this._inputs);
  }
}
