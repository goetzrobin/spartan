import { Directive, HostBinding, Input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

const cardDescriptionVariants = cva('text-sm text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});
export type CardDescriptionVariants = VariantProps<typeof cardDescriptionVariants>;

@Directive({
  selector: '[hlmCardDescription]',
  standalone: true,
})
export class HlmCardDescriptionDirective {
  private _inputs: ClassValue = '';
  @HostBinding('class')
  private _class = this.generateClasses();

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClasses();
  }

  private generateClasses() {
    return hlm(cardDescriptionVariants(), this._inputs);
  }
}
