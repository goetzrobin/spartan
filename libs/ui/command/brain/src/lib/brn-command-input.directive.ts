import { InputDirective } from '@ngneat/cmdk';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector: 'input[brnCmdInput]',
  standalone: true,
  providers: [
    {
      provide: InputDirective,
      useExisting: forwardRef(() => BrnCommandInputDirective),
    },
  ],
  host: {
    class: 'cmdk-input',
  },
})
export class BrnCommandInputDirective extends InputDirective {}
