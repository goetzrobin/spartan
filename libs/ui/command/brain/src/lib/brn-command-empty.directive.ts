import { EmptyDirective } from '@ngneat/cmdk';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector: '[brnCmdEmpty]',
  standalone: true,
  providers: [
    {
      provide: EmptyDirective,
      useExisting: forwardRef(() => BrnCommandEmptyDirective),
    },
  ],
  host: {
    class: 'cmdk-empty',
  },
})
export class BrnCommandEmptyDirective extends EmptyDirective {}
