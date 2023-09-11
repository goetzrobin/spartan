import { Component, HostBinding, Input } from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

const btnLike =
  'aspect-square rounded-full ring-offset-background group-[.cdk-keyboard-focused]:ring-2 group-[.cdk-keyboard-focused]:ring-ring group-[.cdk-keyboard-focused]:ring-offset-2 group-[.brn-radio-disabled]:cursor-not-allowed group-[.brn-radio-disabled]:opacity-50';

@Component({
  selector: 'hlm-radio-indicator',
  standalone: true,
  host: {
    class: 'relative',
  },
  template: `
    <div
      class="scale-[55%] bg-foreground absolute inset-0 hidden group-[.brn-radio-checked]:inline-block rounded-full"
    ></div>
    <div class="border border-primary rounded-full ${btnLike}"></div>
  `,
})
export class HlmRadioIndicatorComponent {
  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  generateClass() {
    return hlm('inline-flex h-4 w-4', this._inputs);
  }
}
